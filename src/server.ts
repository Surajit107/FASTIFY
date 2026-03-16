import './load-env.js';
import { buildApp } from './app.js';
import { env } from './config/env.js';

async function main(): Promise<void> {
  const app = await buildApp();

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info({ port: env.PORT, host: env.HOST }, 'Server listening');
  } catch (err) {
    app.log.fatal({ err }, 'Server failed to start');
    process.exit(1);
  }
}

main();
