export type CertificationVendor = "microsoft" | "aws" | "comptia" | "other";
export type CertificationStatus = "active" | "expired" | "pending" | "unknown";

export interface Certification {
  id: string;
  userId: string;
  name: string;
  vendor: CertificationVendor;
  vendorCertId?: string | null;
  expirationDate: string;
  status: CertificationStatus;
  syncEnabled: boolean;
  lastSyncedAt?: string | null;
  createdAt: string;
  updatedAt: string;
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
