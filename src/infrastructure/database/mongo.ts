import type { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { env } from '../../config/env.js';

export function getDb(client: MongoClient, dbName = env.MONGODB_DB_NAME): Db {
  return client.db(dbName);
}

export function getCollection<T extends Document>(db: Db, name: string): Collection<T> {
  return db.collection<T>(name);
}

export interface Document {
  _id?: ObjectId;
}
