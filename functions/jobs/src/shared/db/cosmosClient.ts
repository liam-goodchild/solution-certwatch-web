import { CosmosClient, Container } from '@azure/cosmos';
import { DefaultAzureCredential } from '@azure/identity';

const endpoint = process.env['COSMOS_ENDPOINT']!;
const databaseId = process.env['COSMOS_DATABASE'] ?? 'certwatch';

let client: CosmosClient | null = null;

function getClient(): CosmosClient {
  if (!client) {
    client = new CosmosClient({ endpoint, aadCredentials: new DefaultAzureCredential() });
  }
  return client;
}

export function getContainer(containerId: string): Container {
  return getClient().database(databaseId).container(containerId);
}

export const containers = {
  users: () => getContainer('users'),
  certifications: () => getContainer('certifications'),
  reminderLogs: () => getContainer('reminderLogs'),
};
