import { EmailClient } from '@azure/communication-email';
import { DefaultAzureCredential } from '@azure/identity';

const endpoint = process.env['ACS_ENDPOINT']!;
const senderEmail = process.env['ACS_SENDER_EMAIL']!;

let emailClient: EmailClient | null = null;

function getEmailClient(): EmailClient {
  if (!emailClient) {
    emailClient = new EmailClient(endpoint, new DefaultAzureCredential());
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

  const poller = await getEmailClient().beginSend({
    senderAddress: senderEmail,
    recipients: { to: [{ address: to }] },
    content: { subject, html },
  });
  await poller.pollUntilDone();
}
