import { ICertificationProvider, ValidationResult, CertStatus } from './base';

export class CompTIACertProvider implements ICertificationProvider {
  readonly vendorId = 'comptia';
  readonly displayName = 'CompTIA';

  async isAvailable(): Promise<boolean> {
    return false; // Integration pending
  }

  async validateCertification(_certId: string): Promise<ValidationResult> {
    return { valid: false, reason: 'CompTIA certification API integration is not yet implemented.' };
  }

  async getCertificationStatus(_certId: string): Promise<CertStatus> {
    return {
      status: 'unknown',
      lastVerified: new Date().toISOString(),
    };
  }
}
