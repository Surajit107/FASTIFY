import type { UserRepository } from './user.repository.js';
import type { User, CreateUserInput, UpdateUserInput } from './user.types.js';
import { hashPassword } from '../../utils/crypto.js';
import { ConflictError, NotFoundError } from '../../errors/app.error.js';

export interface UserService {
  create(input: CreateUserInput): Promise<User>;
  getById(id: string): Promise<User>;
  getByEmail(email: string): Promise<User | null>;
  update(id: string, input: UpdateUserInput): Promise<User>;
}

export function createUserService(repository: UserRepository): UserService {
  return {
    async create(input) {
      const existing = await repository.findByEmail(input.email);
      if (existing) {
        throw new ConflictError('User with this email already exists');
      }
      const passwordHash = hashPassword(input.password);
      return repository.create({
        email: input.email,
        passwordHash,
        name: input.name,
      });
    },

    async getById(id) {
      const user = await repository.findById(id);
      if (!user) throw new NotFoundError('User', id);
      return user;
    },

    async getByEmail(email) {
      return repository.findByEmail(email);
    },

    async update(id, input) {
      const updated = await repository.update(id, input);
      if (!updated) throw new NotFoundError('User', id);
      return updated;
    },
  };
}
