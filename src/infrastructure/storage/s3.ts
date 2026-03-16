import type { Env } from '../../config/env.js';

export interface S3StorageOptions {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export function createS3StorageOptions(env: Env): S3StorageOptions | null {
  if (
    !env.S3_BUCKET ||
    !env.S3_REGION ||
    !env.AWS_ACCESS_KEY_ID ||
    !env.AWS_SECRET_ACCESS_KEY
  ) {
    return null;
  }
  return {
    bucket: env.S3_BUCKET,
    region: env.S3_REGION,
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  };
}

/**
 * Scaffold for S3. Install `@aws-sdk/client-s3` and implement Put/Get/Delete when needed.
 * Not registered in app routes by default.
 */
export async function putS3(
  options: S3StorageOptions | null,
  _key: string,
  _body: Buffer | Uint8Array
): Promise<string | null> {
  if (!options) return null;
  // const client = new S3Client({ region: options.region, credentials: { ... } });
  // await client.send(new PutObjectCommand({ Bucket: options.bucket, Key: key, Body: body }));
  return null;
}

export async function getS3(
  options: S3StorageOptions | null,
  _key: string
): Promise<Buffer | null> {
  if (!options) return null;
  return null;
}

export async function deleteS3(
  options: S3StorageOptions | null,
  _key: string
): Promise<boolean> {
  if (!options) return false;
  return false;
}
