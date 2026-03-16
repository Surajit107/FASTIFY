import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from './app.error.js';

interface ErrorLogger {
  error: (bindings: object, msg?: string) => void;
  warn: (bindings: object, msg?: string) => void;
}

export function createErrorHandler(logger: ErrorLogger) {
  return function errorHandler(
    error: FastifyError | AppError,
    request: FastifyRequest,
    reply: FastifyReply
  ): void {
    const statusCode = error instanceof AppError ? error.statusCode : error.statusCode ?? 500;
    const code = error instanceof AppError ? error.code : 'INTERNAL_ERROR';
    const message = error instanceof AppError ? error.message : 'Internal Server Error';

    if (statusCode >= 500) {
      logger.error(
        { err: error, reqId: request.id, url: request.url, method: request.method },
        error.message
      );
    } else {
      logger.warn({ reqId: request.id, code, message }, 'Client error');
    }

    void reply.status(statusCode).send({
      error: true,
      code,
      message,
      ...(error instanceof AppError && error.details !== undefined ? { details: error.details } : {}),
    });
  };
}
