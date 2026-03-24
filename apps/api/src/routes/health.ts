import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV || 'development',
    };
  });

  fastify.get('/ready', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Check database connection
      // Check Redis connection
      // These would be implemented with actual health checks
      
      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'healthy',
          redis: 'healthy',
        },
      };
    } catch (error) {
      reply.status(503);
      return {
        status: 'not ready',
        timestamp: new Date().toISOString(),
        error: 'Service dependencies not available',
      };
    }
  });
}
