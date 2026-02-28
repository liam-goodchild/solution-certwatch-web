import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { validateToken } from '../../shared/auth/validateToken';
import { providerRegistry } from '../../shared/providers/registry';

async function handler(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  try {
    await validateToken(req);
    const providers = await providerRegistry.listProviders();
    return { status: 200, jsonBody: providers };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return { status: 401, jsonBody: { error: message } };
  }
}

app.http('listProviders', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/providers',
  handler,
});
