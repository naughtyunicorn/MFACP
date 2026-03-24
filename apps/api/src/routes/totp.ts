import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { TotpService } from '../services/totpService';

const totpService = new TotpService();

export async function totpRoutes(fastify: FastifyInstance) {
  fastify.post('/setup', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const result = await totpService.generateSecret(
        body.email,
        body.name
      );
      return reply.code(result.success ? 201 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'TOTP_SETUP_ERROR',
          message: 'Failed to set up TOTP'
        }
      });
    }
  });

  fastify.post('/verify', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const result = await totpService.verifyToken(
        body.email,
        body.token
      );
      return reply.code(result.success ? 200 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'TOTP_VERIFY_ERROR',
          message: 'Failed to verify TOTP token'
        }
      });
    }
  });

  fastify.get('/secrets', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = request.query as any;
      const result = await totpService.getUserTotpSecrets(query.email);
      return reply.code(200).send({
        success: true,
        data: result
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'TOTP_SECRETS_ERROR',
          message: 'Failed to get TOTP secrets'
        }
      });
    }
  });

  fastify.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = request.params as any;
      const body = request.body as any;
      const result = await totpService.deleteTotpSecret(
        params.id,
        body.email
      );
      return reply.code(result.success ? 200 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'TOTP_DELETE_ERROR',
          message: 'Failed to delete TOTP secret'
        }
      });
    }
  });
}
