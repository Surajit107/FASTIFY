import type { FastifyInstance } from 'fastify';
import type { UserRepository } from '../user/user.repository.js';
import { verifyPassword } from '../../utils/crypto.js';
import { UnauthorizedError } from '../../errors/app.error.js';

export interface AuthService {
  login(email: string, password: string): Promise<{ userId: string }>;
  signToken(userId: string): Promise<string>;
}

export function createAuthService(
  fastify: FastifyInstance,
  userRepository: UserRepository
): AuthService {
  return {
    async login(email, password) {
      const result = await userRepository.findByEmailForAuth(email);
      if (!result || !verifyPassword(password, result.passwordHash)) {
        throw new UnauthorizedError('Invalid email or password');
      }
      return { userId: result.user.id };
    },

    async signToken(userId) {
      return fastify.jwt.sign({ sub: userId }, { expiresIn: fastify.config.JWT_EXPIRES_IN });
    },
  };
}
