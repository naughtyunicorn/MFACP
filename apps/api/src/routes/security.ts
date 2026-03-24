import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { SecurityService } from '../services/securityService';

const securityService = new SecurityService();

export async function securityRoutes(fastify: FastifyInstance) {
  fastify.post('/events/log', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const result = await securityService.logSecurityEvent(
        body.email,
        body.eventType,
        body.details,
        request.ip,
        request.headers['user-agent'],
        body.riskScore
      );
      return reply.code(result.success ? 201 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'SECURITY_LOG_ERROR',
          message: 'Failed to log security event'
        }
      });
    }
  });

  fastify.get('/events', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = request.query as any;
      const result = await securityService.getSecurityEvents(
        query.email,
        parseInt(query.limit) || 50,
        parseInt(query.offset) || 0
      );
      return reply.code(200).send({
        success: true,
        data: result
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'SECURITY_EVENTS_ERROR',
          message: 'Failed to get security events'
        }
      });
    }
  });

  fastify.post('/risk/assess', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const result = await securityService.assessUserRisk(body.email);
      return reply.code(result.success ? 200 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'RISK_ASSESSMENT_ERROR',
          message: 'Failed to assess user risk'
        }
      });
    }
  });

  fastify.get('/summary', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = request.query as any;
      const result = await securityService.getSecuritySummary(query.email);
      return reply.code(result.success ? 200 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'SECURITY_SUMMARY_ERROR',
          message: 'Failed to get security summary'
        }
      });
    }
  });
}
