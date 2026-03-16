import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword, sha256 } from '../../utils/crypto.js';

describe('crypto', () => {
  it('hashes and verifies passwords', () => {
    const hash = hashPassword('correct-horse-battery');
    expect(verifyPassword('correct-horse-battery', hash)).toBe(true);
    expect(verifyPassword('wrong-password', hash)).toBe(false);
  });

  it('produces stable sha256 digests', () => {
    expect(sha256('fastify')).toBe(sha256('fastify'));
    expect(sha256('a')).not.toBe(sha256('b'));
  });
});
