export type CertificationVendor = 'microsoft' | 'aws' | 'comptia' | 'other';
export type CertificationStatus = 'active' | 'expired' | 'pending' | 'unknown';

export interface Certification {
  id: string;
  userId: string;
  name: string;
  vendor: CertificationVendor;
  vendorCertId?: string | null;
  expirationDate: string; // ISO date: YYYY-MM-DD
  status: CertificationStatus;
  syncEnabled: boolean;
  lastSyncedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  // Reserved for future multi-tenant support
  tenantId?: string | null;
  assignedToUserId?: string | null;
}

export interface CreateCertificationRequest {
  name: string;
  vendor: CertificationVendor;
  vendorCertId?: string;
  expirationDate: string;
}

export interface UpdateCertificationRequest {
  name?: string;
  vendor?: CertificationVendor;
  vendorCertId?: string | null;
  expirationDate?: string;
  syncEnabled?: boolean;
}
