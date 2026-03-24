import { PrismaClient } from '@mfa-platform/db';
import { createClient, RedisClientType } from 'redis';
import { z } from 'zod';

const prisma = new PrismaClient();

// Redis client singleton
let redisClient: RedisClientType | null = null;

const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        connectTimeout: 5000,
        lazyConnect: true,
      },
    });

    // Handle Redis errors
    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis Client Connected');
    });

    redisClient.on('ready', () => {
      console.log('Redis Client Ready');
    });
  }
  
  return redisClient;
};

const sessionSchema = z.object({
  token: z.string().min(1),
  userId: z.string().min(1),
  sessionType: z.enum(['FULL', 'MFA', 'RECOVERY']),
  trustLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  expiresAt: z.date().optional()
});

export class RedisService {
  async storeSession(sessionData: {
    token: string;
    userId: string;
    sessionType: 'FULL' | 'MFA' | 'RECOVERY';
    trustLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    expiresAt: Date;
  }) {
    try {
      const client = getRedisClient();
      
      // Store session in Redis with expiration
      const sessionKey = `session:${sessionData.token}`;
      const sessionValue = JSON.stringify({
        token: sessionData.token,
        userId: sessionData.userId,
        sessionType: sessionData.sessionType,
        trustLevel: sessionData.trustLevel,
        createdAt: new Date().toISOString(),
        expiresAt: sessionData.expiresAt.toISOString()
      });

      // Set with expiration (TTL in seconds)
      const ttl = Math.floor((sessionData.expiresAt.getTime() - Date.now()) / 1000);
      await client.setEx(sessionKey, sessionValue, {
        EX: ttl
      });

      // Also store in database for persistence
      await prisma.session.create({
        data: {
          userId: sessionData.userId,
          token: sessionData.token,
          sessionType: sessionData.sessionType,
          trustLevel: sessionData.trustLevel,
          expiresAt: sessionData.expiresAt,
          isActive: true,
          requiresReauth: sessionData.sessionType !== 'FULL'
        }
      });

      return {
        success: true,
        data: {
          token: sessionData.token,
          sessionType: sessionData.sessionType,
          trustLevel: sessionData.trustLevel,
          expiresAt: sessionData.expiresAt
        }
      };
    } catch (error) {
      console.error('Store session error:', error);
      return {
        success: false,
        error: {
          code: 'SESSION_STORE_FAILED',
          message: error instanceof Error ? error.message : 'Failed to store session'
        }
      };
    }
  }

  async getSession(token: string) {
    try {
      const client = getRedisClient();
      
      // Get session from Redis first
      const sessionKey = `session:${token}`;
      const redisSession = await client.get(sessionKey);
      
      if (!redisSession) {
        return {
          success: false,
          error: {
            code: 'SESSION_NOT_FOUND',
            message: 'Session not found'
          }
        };
      }

      const sessionData = JSON.parse(redisSession);
      
      // Check if session is expired
      if (new Date(sessionData.expiresAt) < new Date()) {
        // Clean up expired session
        await this.invalidateSession(token);
        return {
          success: false,
          error: {
            code: 'SESSION_EXPIRED',
            message: 'Session has expired'
          }
        };
      }

      // Get full session data from database
      const dbSession = await prisma.session.findFirst({
        where: {
          token,
          isActive: true
        },
        include: {
          user: true
        }
      });

      if (!dbSession) {
        return {
          success: false,
          error: {
            code: 'SESSION_NOT_FOUND',
            message: 'Session not found in database'
          }
        };
      }

      return {
        success: true,
        data: {
          id: dbSession.id,
          token: dbSession.token,
          userId: dbSession.userId,
          sessionType: dbSession.sessionType,
          trustLevel: dbSession.trustLevel,
          expiresAt: dbSession.expiresAt,
          isActive: dbSession.isActive,
          requiresReauth: dbSession.requiresReauth,
          user: {
            id: dbSession.user.id,
            email: dbSession.user.email,
            riskTier: dbSession.user.riskTier
          },
          createdAt: dbSession.createdAt
        }
      };
    } catch (error) {
      console.error('Get session error:', error);
      return {
        success: false,
        error: {
          code: 'SESSION_GET_FAILED',
          message: error instanceof Error ? error.message : 'Failed to get session'
        }
      };
    }
  }

  async invalidateSession(token: string) {
    try {
      const client = getRedisClient();
      
      // Remove from Redis
      const sessionKey = `session:${token}`;
      await client.del(sessionKey);

      // Mark as inactive in database
      await prisma.session.updateMany({
        where: { token },
        data: { isActive: false }
      });

      return {
        success: true,
        message: 'Session invalidated successfully'
      };
    } catch (error) {
      console.error('Invalidate session error:', error);
      return {
        success: false,
        error: {
          code: 'SESSION_INVALIDATE_FAILED',
          message: error instanceof Error ? error.message : 'Failed to invalidate session'
        }
      };
    }
  }

  async invalidateUserSessions(userId: string) {
    try {
      const client = getRedisClient();
      
      // Get all user sessions from Redis
      const pattern = 'session:*';
      const keys = await client.keys(pattern);
      
      let invalidatedCount = 0;
      for (const key of keys) {
        const sessionData = await client.get(key);
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          if (parsed.userId === userId) {
            await client.del(key);
            invalidatedCount++;
          }
        }
      }

      // Mark all user sessions as inactive in database
      await prisma.session.updateMany({
        where: { userId },
        data: { isActive: false }
      });

      return {
        success: true,
        data: {
          invalidatedCount,
          message: `Invalidated ${invalidatedCount} sessions`
        }
      };
    } catch (error) {
      console.error('Invalidate user sessions error:', error);
      return {
        success: false,
        error: {
          code: 'USER_SESSIONS_INVALIDATE_FAILED',
          message: error instanceof Error ? error.message : 'Failed to invalidate user sessions'
        }
      };
    }
  }

  async getActiveSessions(userId: string) {
    try {
      const client = getRedisClient();
      
      // Get all user sessions from Redis
      const pattern = 'session:*';
      const keys = await client.keys(pattern);
      
      const sessions = [];
      for (const key of keys) {
        const sessionData = await client.get(key);
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          if (parsed.userId === userId && new Date(parsed.expiresAt) > new Date()) {
            sessions.push({
              token: parsed.token,
              sessionType: parsed.sessionType,
              trustLevel: parsed.trustLevel,
              expiresAt: parsed.expiresAt,
              createdAt: parsed.createdAt
            });
          }
        }
      }

      return {
        success: true,
        data: {
          sessions,
          count: sessions.length
        }
      };
    } catch (error) {
      console.error('Get active sessions error:', error);
      return {
        success: false,
        error: {
          code: 'ACTIVE_SESSIONS_GET_FAILED',
          message: error instanceof Error ? error.message : 'Failed to get active sessions'
        }
      };
    }
  }

  async cleanupExpiredSessions() {
    try {
      const client = getRedisClient();
      
      // Get all session keys
      const pattern = 'session:*';
      const keys = await client.keys(pattern);
      
      let cleanedCount = 0;
      for (const key of keys) {
        const sessionData = await client.get(key);
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          if (new Date(parsed.expiresAt) < new Date()) {
            await client.del(key);
            cleanedCount++;
          }
        }
      }

      return {
        success: true,
        data: {
          cleanedCount,
          message: `Cleaned up ${cleanedCount} expired sessions`
        }
      };
    } catch (error) {
      console.error('Cleanup expired sessions error:', error);
      return {
        success: false,
        error: {
          code: 'SESSION_CLEANUP_FAILED',
          message: error instanceof Error ? error.message : 'Failed to cleanup expired sessions'
        }
      };
    }
  }

  async disconnect() {
    if (redisClient) {
      await redisClient.quit();
      redisClient = null;
    }
  }
}
