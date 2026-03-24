import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@mfa-platform/db';

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export class AuthService {
  async register(email: string, password: string) {
    try {
      // Validate input
      const validated = registerSchema.parse({ email, password });
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: validated.email }
      });
      
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(validated.password, 12);
      
      // Create user
      const user = await prisma.user.create({
        data: {
          email: validated.email,
          passwordHash,
          emailVerified: false,
          riskTier: 'LOW',
          isLocked: false
        }
      });
      
      return {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
          riskTier: user.riskTier,
          createdAt: user.createdAt
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: error instanceof Error ? error.message : 'Registration failed'
        }
      };
    }
  }
  
  async login(email: string, password: string) {
    try {
      // Validate input
      const validated = loginSchema.parse({ email, password });
      
      // Find user
      const user = await prisma.user.findUnique({
        where: { email: validated.email }
      });
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      if (user.isLocked) {
        throw new Error('Account is locked');
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(validated.password, user.passwordHash || '');
      
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }
      
      // Create session
      const sessionToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );
      
      // Store session in database
      const session = await prisma.session.create({
        data: {
          userId: user.id,
          token: sessionToken,
          sessionType: 'FULL',
          trustLevel: 'FULL',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          requiresReauth: false
        }
      });
      
      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            emailVerified: user.emailVerified,
            riskTier: user.riskTier,
            isLocked: user.isLocked,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          },
          session: {
            id: session.id,
            token: sessionToken,
            sessionType: session.sessionType,
            trustLevel: session.trustLevel,
            expiresAt: session.expiresAt,
            requiresReauth: session.requiresReauth
          }
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: error instanceof Error ? error.message : 'Login failed'
        }
      };
    }
  }
  
  async logout(sessionToken: string) {
    try {
      // Invalidate session
      await prisma.session.updateMany({
        where: { token: sessionToken },
        data: { isActive: false }
      });
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: {
          code: 'LOGOUT_FAILED',
          message: error instanceof Error ? error.message : 'Logout failed'
        }
      };
    }
  }
  
  async getProfile(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          devices: true,
          authenticators: true,
          webauthnCredentials: true,
          smartCards: true
        }
      });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
          riskTier: user.riskTier,
          isLocked: user.isLocked,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          devices: user.devices,
          authenticators: user.authenticators,
          webauthnCredentials: user.webauthnCredentials,
          smartCards: user.smartCards
        }
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: {
          code: 'PROFILE_FAILED',
          message: error instanceof Error ? error.message : 'Failed to get profile'
        }
      };
    }
  }
}
