import { EmailClient } from '@azure/communication-email';

const connectionString = process.env['ACS_CONNECTION_STRING']!;
const senderEmail = process.env['ACS_SENDER_EMAIL']!;

let emailClient: EmailClient | null = null;

function getEmailClient(): EmailClient {
  if (!emailClient) {
    emailClient = new EmailClient(connectionString);
  }
  return emailClient;
}

export interface SendReminderEmailOptions {
  to: string;
  certificationName: string;
  vendor: string;
  expirationDate: string;
  daysUntilExpiry: number;
}

export async function sendReminderEmail(opts: SendReminderEmailOptions): Promise<void> {
  const { to, certificationName, vendor, expirationDate, daysUntilExpiry } = opts;

  const subject = `Certification expiring in ${daysUntilExpiry} days: ${certificationName}`;

  const html = `
    <h2>Certification Expiry Reminder</h2>
    <p>Your <strong>${certificationName}</strong> (${vendor}) certification expires on <strong>${expirationDate}</strong>.</p>
    <p>That is <strong>${daysUntilExpiry} days</strong> from now.</p>
    <p>Log in to CertWatch to view your certifications and plan your renewal.</p>
  `.trim();

  const message = {
    senderAddress: senderEmail,
    recipients: { to: [{ address: to }] },
    content: { subject, html },
  };

  const poller = await getEmailClient().beginSend(message);
  await poller.pollUntilDone();
}
