import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { validateToken } from '../../shared/auth/validateToken';
import { containers } from '../../shared/db/cosmosClient';
import { User } from '../../shared/models/user';

async function handler(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  try {
    const auth = await validateToken(req);
    const { resource } = await containers.users().item(auth.userId, auth.userId).read<User>();

    if (!resource) {
      return { status: 404, jsonBody: { error: 'User profile not found. Call PUT /v1/users/me first.' } };
    }

    return { status: 200, jsonBody: resource.reminderPreferences };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return { status: 401, jsonBody: { error: message } };
  }
}

app.http('getReminderPreferences', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/reminders/preferences',
  handler,
});
