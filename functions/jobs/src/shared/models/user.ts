export interface ReminderPreferences {
  emailEnabled: boolean;
  emailDaysBefore: number[];
  smsEnabled: boolean;
  smsDaysBefore: number[];
}

export interface User {
  id: string;
  userId: string;
  email: string;
  displayName: string;
  reminderPreferences: ReminderPreferences;
  createdAt: string;
  updatedAt: string;
  // Reserved for future multi-tenant support
  tenantId?: string | null;
  role?: 'user' | 'admin' | 'org-admin';
}

export type UserProfileResponse = Omit<User, 'tenantId'>;

export interface UpdateUserRequest {
  displayName?: string;
  reminderPreferences?: Partial<ReminderPreferences>;
}
