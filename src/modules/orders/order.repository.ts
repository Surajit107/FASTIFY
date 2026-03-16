import type { ObjectId } from 'mongodb';
import { getDb, getCollection, type Document } from '../../infrastructure/database/mongo.js';
import type { MongoClient } from 'mongodb';

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPriceCents: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalCents: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION = 'orders';

interface OrderDoc extends Document {
  userId: string;
  items: OrderItem[];
  totalCents: number;
  status: Order['status'];
  createdAt: Date;
  updatedAt: Date;
}

function toOrder(doc: OrderDoc & { _id: ObjectId }): Order {
  return {
    id: doc._id.toHexString(),
    userId: doc.userId,
    items: doc.items,
    totalCents: doc.totalCents,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export interface OrderRepository {
  create(data: { userId: string; items: OrderItem[]; totalCents: number }): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string, limit?: number): Promise<Order[]>;
}

export function createOrderRepository(mongo: MongoClient): OrderRepository {
  const db = getDb(mongo);
  const coll = getCollection<OrderDoc>(db, COLLECTION);

  return {
    async create(data) {
      const now = new Date();
      const doc: Omit<OrderDoc, '_id'> = {
        userId: data.userId,
        items: data.items,
        totalCents: data.totalCents,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      };
      const result = await coll.insertOne(doc as OrderDoc);
      return toOrder({ _id: result.insertedId, ...doc } as OrderDoc & { _id: ObjectId });
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
      return doc ? toOrder(doc as OrderDoc & { _id: ObjectId }) : null;
    },

    async findByUserId(userId, limit = 50) {
      const cursor = coll
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit);
      const docs = await cursor.toArray();
      return docs.map((d) => toOrder(d as OrderDoc & { _id: ObjectId }));
    },
  };
}
