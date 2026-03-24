import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { RecoveryService } from '../services/recoveryService';

const recoveryService = new RecoveryService();

export async function recoveryRoutes(fastify: FastifyInstance) {
  fastify.post('/generate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const result = await recoveryService.generateRecoveryCodes(
        body.email,
        body.count
      );
      return reply.code(result.success ? 201 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'RECOVERY_GENERATE_ERROR',
          message: 'Failed to generate recovery codes'
        }
      });
    }
  });

  fastify.post('/verify', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const result = await recoveryService.verifyRecoveryCode(
        body.email,
        body.code
      );
      return reply.code(result.success ? 200 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'RECOVERY_VERIFY_ERROR',
          message: 'Failed to verify recovery code'
        }
      });
    }
  });

  fastify.get('/batches', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = request.query as any;
      const result = await recoveryService.getRecoveryCodeBatches(query.email);
      return reply.code(200).send({
        success: true,
        data: result
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'RECOVERY_BATCHES_ERROR',
          message: 'Failed to get recovery code batches'
        }
      });
    }
  });

  fastify.put('/:batchId/revoke', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = request.params as any;
      const body = request.body as any;
      const result = await recoveryService.revokeRecoveryBatch(
        params.batchId,
        body.email
      );
      return reply.code(result.success ? 200 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'RECOVERY_REVOKE_ERROR',
          message: 'Failed to revoke recovery batch'
        }
      });
    }
  });
}
