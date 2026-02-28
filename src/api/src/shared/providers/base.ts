export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export interface CertStatus {
  status: 'active' | 'expired' | 'pending' | 'unknown';
  expirationDate?: string;
  lastVerified: string;
}

export interface ICertificationProvider {
  readonly vendorId: string;
  readonly displayName: string;
  isAvailable(): Promise<boolean>;
  validateCertification(certId: string): Promise<ValidationResult>;
  getCertificationStatus(certId: string): Promise<CertStatus>;
}
