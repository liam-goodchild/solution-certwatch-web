import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { validateToken } from '../../shared/auth/validateToken';
import { containers } from '../../shared/db/cosmosClient';
import { Certification } from '../../shared/models/certification';
import { providerRegistry } from '../../shared/providers/registry';

async function handler(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  try {
    const auth = await validateToken(req);
    const id = req.params['id'];

    const container = containers.certifications();
    const { resource: cert } = await container.item(id, auth.userId).read<Certification>();

    if (!cert || cert.userId !== auth.userId) {
      return { status: 404, jsonBody: { error: 'Certification not found.' } };
    }

    const provider = providerRegistry.getProvider(cert.vendor);
    if (!provider) {
      return { status: 422, jsonBody: { error: `No provider registered for vendor: ${cert.vendor}` } };
    }

    const isAvailable = await provider.isAvailable();
    if (!isAvailable) {
      return {
        status: 202,
        jsonBody: { status: 'unavailable', message: `${provider.displayName} integration is not yet available.` },
      };
    }

    const certStatus = cert.vendorCertId
      ? await provider.getCertificationStatus(cert.vendorCertId)
      : { status: 'unknown' as const, lastVerified: new Date().toISOString() };

    const updated: Certification = {
      ...cert,
      status: certStatus.status,
      expirationDate: certStatus.expirationDate ?? cert.expirationDate,
      lastSyncedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await container.items.upsert<Certification>(updated);
    return { status: 202, jsonBody: { status: 'synced', certificationStatus: certStatus.status } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return { status: 401, jsonBody: { error: message } };
  }
}

app.http('syncCertification', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'v1/certifications/{id}/sync',
  handler,
});
