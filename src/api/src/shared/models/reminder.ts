export interface ReminderLog {
  id: string;
  userId: string;
  certificationId: string;
  channel: 'email' | 'sms';
  daysBeforeExpiry: number;
  sentAt: string;
  status: 'sent' | 'failed';
}
