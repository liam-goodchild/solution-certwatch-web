import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { validateToken } from '../../shared/auth/validateToken';
import { containers } from '../../shared/db/cosmosClient';
import { sendReminderEmail } from '../../shared/notifications/emailService';
import { User } from '../../shared/models/user';

async function handler(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  try {
    const auth = await validateToken(req);
    const { resource: user } = await containers.users().item(auth.userId, auth.userId).read<User>();

    if (!user) {
      return { status: 404, jsonBody: { error: 'User profile not found. Call PUT /v1/users/me first.' } };
    }

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);

    await sendReminderEmail({
      to: user.email,
      certificationName: 'Test Certification',
      vendor: 'CertWatch',
      expirationDate: futureDate.toISOString().split('T')[0],
      daysUntilExpiry: 30,
    });

    return { status: 200, jsonBody: { status: 'sent' } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return { status: 401, jsonBody: { error: message } };
  }
}

app.http('testNotification', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'v1/reminders/test',
  handler,
});
