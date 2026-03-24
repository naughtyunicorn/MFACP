import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const result = await authService.register(body.email, body.password);
      return reply.code(result.success ? 201 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'REGISTRATION_ERROR',
          message: 'Registration failed'
        }
      });
    }
  });

  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const result = await authService.login(body.email, body.password);
      return reply.code(result.success ? 200 : 401).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'LOGIN_ERROR',
          message: 'Login failed'
        }
      });
    }
  });

  fastify.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const result = await authService.logout(body.token);
      return reply.code(result.success ? 200 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'LOGOUT_ERROR',
          message: 'Logout failed'
        }
      });
    }
  });

  fastify.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Extract token from Authorization header
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.code(401).send({
          success: false,
          error: {
            code: 'NO_TOKEN',
            message: 'No authorization token provided'
          }
        });
      }
      
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      
      const result = await authService.getProfile(decoded.userId);
      return reply.code(result.success ? 200 : 404).send(result);
    } catch (error) {
      return reply.code(401).send({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid token'
        }
      });
    }
  });
}
