import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { validateToken } from '../../shared/auth/validateToken';
import { containers } from '../../shared/db/cosmosClient';
import { Certification } from '../../shared/models/certification';

async function handler(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  try {
    const auth = await validateToken(req);
    const id = req.params['id'];

    const container = containers.certifications();
    const { resource: existing } = await container.item(id, auth.userId).read<Certification>();

    if (!existing || existing.userId !== auth.userId) {
      return { status: 404, jsonBody: { error: 'Certification not found.' } };
    }

    await container.item(id, auth.userId).delete();
    return { status: 204 };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return { status: 401, jsonBody: { error: message } };
  }
}

app.http('deleteCertification', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'v1/certifications/{id}',
  handler,
});
