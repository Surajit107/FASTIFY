import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import { MongoClient } from 'mongodb';
import { ensureIndexes } from '../infrastructure/database/indexes.js';

async function mongodbPlugin(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
): Promise<void> {
  const uri = fastify.config.MONGODB_URI;
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(fastify.config.MONGODB_DB_NAME);
  await ensureIndexes(db);

  fastify.decorate('mongo', client);
  fastify.log.info({ db: fastify.config.MONGODB_DB_NAME }, 'MongoDB connected');

  fastify.addHook('onClose', async (instance) => {
    await instance.mongo.close();
  });
}

export default fp(mongodbPlugin, { name: 'mongodb-plugin' });
