import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { validateToken } from '../../shared/auth/validateToken';
import { containers } from '../../shared/db/cosmosClient';
import { Certification } from '../../shared/models/certification';

async function handler(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  try {
    const auth = await validateToken(req);

    const { resources } = await containers
      .certifications()
      .items.query<Certification>({
        query: 'SELECT * FROM c WHERE c.userId = @userId ORDER BY c.expirationDate ASC',
        parameters: [{ name: '@userId', value: auth.userId }],
      })
      .fetchAll();

    return { status: 200, jsonBody: resources };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return { status: 401, jsonBody: { error: message } };
  }
}

app.http('listCertifications', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/certifications',
  handler,
});
