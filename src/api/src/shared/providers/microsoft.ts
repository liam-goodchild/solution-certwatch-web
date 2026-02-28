import { ICertificationProvider, ValidationResult, CertStatus } from './base';

export class MicrosoftCertProvider implements ICertificationProvider {
  readonly vendorId = 'microsoft';
  readonly displayName = 'Microsoft';

  async isAvailable(): Promise<boolean> {
    return false; // Integration pending
  }

  async validateCertification(_certId: string): Promise<ValidationResult> {
    return { valid: false, reason: 'Microsoft certification API integration is not yet implemented.' };
  }

  async getCertificationStatus(_certId: string): Promise<CertStatus> {
    return {
      status: 'unknown',
      lastVerified: new Date().toISOString(),
    };
  }
}
