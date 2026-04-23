export interface ReminderPreferences {
  emailEnabled: boolean;
  emailDaysBefore: number[];
  smsEnabled: boolean;
  smsDaysBefore: number[];
}

export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  displayName: string;
  reminderPreferences: ReminderPreferences;
  createdAt: string;
  updatedAt: string;
}
