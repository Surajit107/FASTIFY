import pino, { type LoggerOptions } from 'pino';
import { env } from './env.js';

const isDev = env.NODE_ENV === 'development';

const prettyOptions = {
  colorize: true,
  translateTime: 'HH:MM:ss',
  levelFirst: true,
  singleLine: true,
  messageFormat: '[{time}] {levelLabel}  {msg}',
};

/**
 * Pino options for Fastify 5 (config object, not a logger instance).
 */
export const loggerOptions: LoggerOptions = {
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  ...(isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: prettyOptions,
        },
      }
    : {}),
  base: {
    name: 'fastify-app',
    env: env.NODE_ENV,
  },
  formatters: {
    level: (label: string) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};
