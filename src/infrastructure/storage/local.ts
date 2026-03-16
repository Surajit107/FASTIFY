import { readFile, writeFile, mkdir, access, unlink } from 'fs/promises';
import { join } from 'path';
import type { Env } from '../../config/env.js';

export interface LocalStorageOptions {
  basePath: string;
}

export function createLocalStorage(env: Env): LocalStorageOptions {
  return { basePath: env.LOCAL_STORAGE_PATH };
}

export async function ensureDir(path: string): Promise<void> {
  try {
    await access(path);
  } catch {
    await mkdir(path, { recursive: true });
  }
}

export async function putLocal(
  options: LocalStorageOptions,
  key: string,
  body: Buffer | Uint8Array
): Promise<string> {
  await ensureDir(options.basePath);
  const filePath = join(options.basePath, key);
  await writeFile(filePath, body);
  return filePath;
}

export async function getLocal(
  options: LocalStorageOptions,
  key: string
): Promise<Buffer | null> {
  try {
    return await readFile(join(options.basePath, key));
  } catch {
    return null;
  }
}

export async function deleteLocal(options: LocalStorageOptions, key: string): Promise<boolean> {
  try {
    await unlink(join(options.basePath, key));
    return true;
  } catch {
    return false;
  }
}
