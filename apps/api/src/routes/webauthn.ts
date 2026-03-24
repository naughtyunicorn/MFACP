import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { WebAuthnService } from '../services/webauthnService';

const webauthnService = new WebAuthnService();

export async function webauthnRoutes(fastify: FastifyInstance) {
  fastify.post('/register/options', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const result = await webauthnService.generateRegistrationOptions(
        body.email,
        body.displayName,
        body.username
      );
      return reply.code(result.success ? 200 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'WEBAUTHN_REG_OPTIONS_ERROR',
          message: 'Failed to generate registration options'
        }
      });
    }
  });

  fastify.post('/register/verify', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const result = await webauthnService.verifyRegistration(
        body.email,
        body.credential
      );
      return reply.code(result.success ? 201 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'WEBAUTHN_REG_VERIFY_ERROR',
          message: 'Failed to verify registration'
        }
      });
    }
  });

  fastify.post('/login/options', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const result = await webauthnService.generateAuthenticationOptions(body.email);
      return reply.code(result.success ? 200 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'WEBAUTHN_AUTH_OPTIONS_ERROR',
          message: 'Failed to generate authentication options'
        }
      });
    }
  });

  fastify.post('/login/verify', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const result = await webauthnService.verifyAuthentication(
        body.email,
        body.credential
      );
      return reply.code(result.success ? 200 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'WEBAUTHN_AUTH_VERIFY_ERROR',
          message: 'Failed to verify authentication'
        }
      });
    }
  });
}
