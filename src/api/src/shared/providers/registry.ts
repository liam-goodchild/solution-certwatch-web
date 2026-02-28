import { ICertificationProvider } from './base';

export interface ProviderInfo {
  vendorId: string;
  displayName: string;
  available: boolean;
}

class ProviderRegistry {
  private readonly providers = new Map<string, ICertificationProvider>();

  register(provider: ICertificationProvider): void {
    this.providers.set(provider.vendorId, provider);
  }

  getProvider(vendorId: string): ICertificationProvider | undefined {
    return this.providers.get(vendorId);
  }

  async listProviders(): Promise<ProviderInfo[]> {
    const results: ProviderInfo[] = [];
    for (const provider of this.providers.values()) {
      results.push({
        vendorId: provider.vendorId,
        displayName: provider.displayName,
        available: await provider.isAvailable(),
      });
    }
    return results;
  }
}

export const providerRegistry = new ProviderRegistry();
