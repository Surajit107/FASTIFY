import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const SALT_LEN = 16;
const KEY_LEN = 64;
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1 };

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LEN);
  const derived = scryptSync(password, salt, KEY_LEN, SCRYPT_OPTIONS);
  return `${salt.toString('hex')}:${derived.toString('hex')}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, keyHex] = stored.split(':');
  if (!saltHex || !keyHex) return false;
  const salt = Buffer.from(saltHex, 'hex');
  const key = Buffer.from(keyHex, 'hex');
  const derived = scryptSync(password, salt, KEY_LEN, SCRYPT_OPTIONS);
  return key.length === derived.length && timingSafeEqual(key, derived);
}

export function sha256(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString('hex');
}
