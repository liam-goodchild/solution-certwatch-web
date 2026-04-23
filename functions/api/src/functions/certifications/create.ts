import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { v4 as uuidv4 } from 'uuid';
import { validateToken } from '../../shared/auth/validateToken';
import { containers } from '../../shared/db/cosmosClient';
import { Certification, CreateCertificationRequest } from '../../shared/models/certification';

const VALID_VENDORS = ['microsoft', 'aws', 'comptia', 'other'] as const;

async function handler(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  try {
    const auth = await validateToken(req);
    const body = (await req.json()) as CreateCertificationRequest;

    if (!body.name?.trim()) {
      return { status: 400, jsonBody: { error: 'name is required.' } };
    }
    if (!VALID_VENDORS.includes(body.vendor as typeof VALID_VENDORS[number])) {
      return { status: 400, jsonBody: { error: `vendor must be one of: ${VALID_VENDORS.join(', ')}.` } };
    }
    if (!body.expirationDate || !/^\d{4}-\d{2}-\d{2}$/.test(body.expirationDate)) {
      return { status: 400, jsonBody: { error: 'expirationDate must be in YYYY-MM-DD format.' } };
    }

    const now = new Date().toISOString();
    const cert: Certification = {
      id: uuidv4(),
      userId: auth.userId,
      name: body.name.trim(),
      vendor: body.vendor,
      vendorCertId: body.vendorCertId ?? null,
      expirationDate: body.expirationDate,
      status: new Date(body.expirationDate) < new Date() ? 'expired' : 'active',
      syncEnabled: false,
      lastSyncedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    const { resource } = await containers.certifications().items.create<Certification>(cert);
    return { status: 201, jsonBody: resource };
  } catch (err: unknown) {
    if (err instanceof SyntaxError) {
      return { status: 400, jsonBody: { error: 'Invalid JSON body.' } };
    }
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return { status: 401, jsonBody: { error: message } };
  }
}

app.http('createCertification', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'v1/certifications',
  handler,
});
