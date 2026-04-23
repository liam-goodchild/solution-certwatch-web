import { CosmosClient, Container } from '@azure/cosmos';

const endpoint = process.env['COSMOS_ENDPOINT']!;
const key = process.env['COSMOS_KEY']!;
const databaseId = process.env['COSMOS_DATABASE'] ?? 'certwatch';

let client: CosmosClient | null = null;

function getClient(): CosmosClient {
  if (!client) {
    client = new CosmosClient({ endpoint, key });
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
