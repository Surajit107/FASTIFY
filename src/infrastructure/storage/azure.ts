import type { Env } from '../../config/env.js';

export interface AzureStorageOptions {
  connectionString: string;
  container: string;
}

export function createAzureStorageOptions(
  env: Env,
  container = 'uploads'
): AzureStorageOptions | null {
  if (!env.AZURE_STORAGE_CONNECTION_STRING) return null;
  return {
    connectionString: env.AZURE_STORAGE_CONNECTION_STRING,
    container,
  };
}

/**
 * Scaffold for Azure Blob. Install `@azure/storage-blob` and implement when needed.
 * Not registered in app routes by default.
 */
export async function putAzure(
  options: AzureStorageOptions | null,
  _key: string,
  _body: Buffer | Uint8Array
): Promise<string | null> {
  if (!options) return null;
  return null;
}

export async function getAzure(
  options: AzureStorageOptions | null,
  _key: string
): Promise<Buffer | null> {
  if (!options) return null;
  return null;
}

export async function deleteAzure(
  options: AzureStorageOptions | null,
  _key: string
): Promise<boolean> {
  if (!options) return false;
  return false;
}
