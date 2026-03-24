import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { SmartCardService } from '../services/smartCardService';

const smartCardService = new SmartCardService();

export async function cardRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const result = await smartCardService.registerCard(
        body.email,
        body.cardAid,
        body.cardName
      );
      return reply.code(result.success ? 201 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'CARD_REGISTER_ERROR',
          message: 'Failed to register smart card'
        }
      });
    }
  });

  fastify.post('/challenge', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const result = await smartCardService.generateChallenge(
        body.email,
        body.cardId
      );
      return reply.code(result.success ? 200 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'CARD_CHALLENGE_ERROR',
          message: 'Failed to generate card challenge'
        }
      });
    }
  });

  fastify.post('/verify', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const result = await smartCardService.verifyCard(
        body.email,
        body.cardId,
        body.challenge,
        body.response
      );
      return reply.code(result.success ? 200 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'CARD_VERIFY_ERROR',
          message: 'Failed to verify smart card'
        }
      });
    }
  });

  fastify.get('/list', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = request.query as any;
      const result = await smartCardService.getUserCards(query.email);
      return reply.code(200).send({
        success: true,
        data: result
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'CARD_LIST_ERROR',
          message: 'Failed to get smart cards'
        }
      });
    }
  });

  fastify.delete('/:cardId', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = request.params as any;
      const body = request.body as any;
      const result = await smartCardService.deleteCard(
        params.cardId,
        body.email
      );
      return reply.code(result.success ? 200 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'CARD_DELETE_ERROR',
          message: 'Failed to delete smart card'
        }
      });
    }
  });
}
