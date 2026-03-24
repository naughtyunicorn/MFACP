import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import redis from '@fastify/redis';
import session from '@fastify/session';
import cookie from '@fastify/cookie';

import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth';
import { webauthnRoutes } from './routes/webauthn';
import { cardRoutes } from './routes/card';
import { recoveryRoutes } from './routes/recovery';
import { totpRoutes } from './routes/totp';
import { deviceRoutes } from './routes/device';
import { securityRoutes } from './routes/security';
import { healthRoutes } from './routes/health';

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

// Register plugins
server.register(cors, {
  origin: config.webUrl,
  credentials: true,
});

server.register(helmet, {
  contentSecurityPolicy: false,
});

server.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  skipOnError: true,
});

server.register(redis, {
  host: config.redisHost,
  port: config.redisPort,
});

server.register(cookie);

server.register(session, {
  secret: config.sessionSecret,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
});

// Register error handler
server.setErrorHandler(errorHandler);

// Register routes
server.register(healthRoutes, { prefix: '/health' });
server.register(authRoutes, { prefix: '/v1/auth' });
server.register(webauthnRoutes, { prefix: '/v1/webauthn' });
server.register(cardRoutes, { prefix: '/v1/card' });
server.register(recoveryRoutes, { prefix: '/v1/recovery-codes' });
server.register(totpRoutes, { prefix: '/v1/totp' });
server.register(deviceRoutes, { prefix: '/v1/devices' });
server.register(securityRoutes, { prefix: '/v1/security' });

// Start server
const start = async () => {
  try {
    await server.listen({ 
      port: config.port, 
      host: '0.0.0.0' 
    });
    console.log(`API server listening on port ${config.port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
