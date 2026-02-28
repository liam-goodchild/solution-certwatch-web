import { ICertificationProvider, ValidationResult, CertStatus } from './base';

export class AWSCertProvider implements ICertificationProvider {
  readonly vendorId = 'aws';
  readonly displayName = 'Amazon Web Services';

  async isAvailable(): Promise<boolean> {
    return false; // Integration pending
  }

  async validateCertification(_certId: string): Promise<ValidationResult> {
    return { valid: false, reason: 'AWS certification API integration is not yet implemented.' };
  }

  async getCertificationStatus(_certId: string): Promise<CertStatus> {
    return {
      status: 'unknown',
      lastVerified: new Date().toISOString(),
    };
  }
}
