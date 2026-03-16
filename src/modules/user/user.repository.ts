import type { ObjectId } from 'mongodb';
import type { User } from './user.types.js';
import { getDb, getCollection, type Document } from '../../infrastructure/database/mongo.js';
import type { MongoClient } from 'mongodb';

const COLLECTION = 'users';

interface UserDoc extends Document {
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

function toUser(doc: UserDoc & { _id: ObjectId }): User {
  return {
    id: doc._id.toHexString(),
    email: doc.email,
    name: doc.name,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export interface UserWithHash {
  user: User;
  passwordHash: string;
}

export interface UserRepository {
  create(data: { email: string; passwordHash: string; name: string }): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailForAuth(email: string): Promise<UserWithHash | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, data: { name?: string }): Promise<User | null>;
}

export function createUserRepository(mongo: MongoClient): UserRepository {
  const db = getDb(mongo);
  const coll = getCollection<UserDoc>(db, COLLECTION);

  return {
    async create(data) {
      const now = new Date();
      const doc: Omit<UserDoc, '_id'> = {
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name,
        createdAt: now,
        updatedAt: now,
      };
      const result = await coll.insertOne(doc as UserDoc);
      return toUser({ _id: result.insertedId, ...doc } as UserDoc & { _id: ObjectId });
    },

    async findByEmail(email) {
      const doc = await coll.findOne({ email });
      return doc ? toUser(doc as UserDoc & { _id: ObjectId }) : null;
    },

    async findByEmailForAuth(email) {
      const doc = await coll.findOne({ email });
      if (!doc) return null;
      const user = toUser(doc as UserDoc & { _id: ObjectId });
      return { user, passwordHash: doc.passwordHash };
    },

    async findById(id) {
      const { ObjectId } = await import('mongodb');
      let oid: ObjectId;
      try {
        oid = new ObjectId(id);
      } catch {
        return null;
      }
      const doc = await coll.findOne({ _id: oid });
      return doc ? toUser(doc as UserDoc & { _id: ObjectId }) : null;
    },

    async update(id, data) {
      const { ObjectId } = await import('mongodb');
      let oid: ObjectId;
      try {
        oid = new ObjectId(id);
      } catch {
        return null;
      }
      const update: Partial<UserDoc> = { updatedAt: new Date(), ...data };
      const doc = await coll.findOneAndUpdate(
        { _id: oid },
        { $set: update },
        { returnDocument: 'after' }
      );
      return doc ? toUser(doc as UserDoc & { _id: ObjectId }) : null;
    },
  };
}
