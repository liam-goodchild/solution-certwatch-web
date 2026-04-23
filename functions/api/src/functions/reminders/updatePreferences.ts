import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { validateToken } from '../../shared/auth/validateToken';
import { containers } from '../../shared/db/cosmosClient';
import { User, ReminderPreferences } from '../../shared/models/user';

async function handler(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  try {
    const auth = await validateToken(req);
    const body = (await req.json()) as Partial<ReminderPreferences>;

    const container = containers.users();
    const { resource: existing } = await container.item(auth.userId, auth.userId).read<User>();

    if (!existing) {
      return { status: 404, jsonBody: { error: 'User profile not found. Call PUT /v1/users/me first.' } };
    }

    const updated: User = {
      ...existing,
      reminderPreferences: {
        ...existing.reminderPreferences,
        ...body,
      },
      updatedAt: new Date().toISOString(),
    };

    await container.items.upsert<User>(updated);
    return { status: 200, jsonBody: updated.reminderPreferences };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return { status: 401, jsonBody: { error: message } };
  }
}

app.http('updateReminderPreferences', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'v1/reminders/preferences',
  handler,
});
