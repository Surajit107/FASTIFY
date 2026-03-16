import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

/**
 * Morgan-style HTTP request logging: METHOD url status responseTime ms - contentLength
 */
export function registerRequestLogger(fastify: FastifyInstance): void {
  fastify.addHook('onResponse', (request: FastifyRequest, reply: FastifyReply, done) => {
    const method = request.method;
    const url = request.url;
    const statusCode = reply.statusCode;
    const responseTime = reply.elapsedTime != null ? reply.elapsedTime.toFixed(2) : '-';
    const contentLength = reply.getHeader('content-length') ?? '-';
    const line = `[${request.id}] ${method} ${url} ${statusCode} ${responseTime}ms - ${contentLength}`;
    fastify.log.info({ reqId: request.id }, line);
    done();
  });
}
