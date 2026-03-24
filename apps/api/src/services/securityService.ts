import { PrismaClient } from '@mfa-platform/db';
import { z } from 'zod';
import crypto from 'crypto';

const prisma = new PrismaClient();

const logEventSchema = z.object({
  email: z.string().email(),
  eventType: z.enum(['LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOGIN_MFA_REQUIRED', 'LOGIN_MFA_SUCCESS', 'LOGIN_MFA_FAILURE', 'DEVICE_REGISTERED', 'DEVICE_REVOKED', 'TOTP_ENABLED', 'TOTP_DISABLED', 'WEBAUTHN_ENABLED', 'WEBAUTHN_DISABLED', 'CARD_ENABLED', 'CARD_DISABLED', 'RECOVERY_CODE_USED', 'RECOVERY_CODE_GENERATED', 'RISK_ASSESSMENT_CHANGED']),
  details: z.record(z.any()).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  riskScore: z.number().min(0).max(100).optional()
});

export class SecurityService {
  async logSecurityEvent(email: string, eventType: string, details?: any, ipAddress?: string, userAgent?: string, riskScore?: number) {
    try {
      const userId = await this.getUserIdByEmail(email);
      
      // Calculate risk level based on score
      const riskLevel = riskScore ? this.calculateRiskLevel(riskScore) : 'UNKNOWN';
      
      const securityEvent = await prisma.securityEvent.create({
        data: {
          userId,
          eventType,
          details: details || {},
          ipAddress: ipAddress || 'unknown',
          userAgent: userAgent || 'unknown',
          riskScore: riskScore || 0,
          riskLevel,
          timestamp: new Date()
        }
      });

      // Update user risk tier if needed
      if (riskScore !== undefined) {
        await this.updateUserRiskTier(userId, riskScore);
      }

      return {
        success: true,
        data: {
          id: securityEvent.id,
          eventType,
          riskScore: securityEvent.riskScore,
          riskLevel: securityEvent.riskLevel,
          timestamp: securityEvent.timestamp
        }
      };
    } catch (error) {
      console.error('Security event logging error:', error);
      return {
        success: false,
        error: {
          code: 'SECURITY_EVENT_LOG_FAILED',
          message: error instanceof Error ? error.message : 'Failed to log security event'
        }
      };
    }
  }

  async getSecurityEvents(email: string, limit: number = 50, offset: number = 0) {
    try {
      const events = await prisma.securityEvent.findMany({
        where: {
          user: { email }
        },
        orderBy: {
          timestamp: 'desc'
        },
        take: limit,
        skip: offset
      });

      return events.map(event => ({
        id: event.id,
        eventType: event.eventType,
        details: event.details,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        riskScore: event.riskScore,
        riskLevel: event.riskLevel,
        timestamp: event.timestamp
      }));
    } catch (error) {
      console.error('Get security events error:', error);
      return [];
    }
  }

  async assessUserRisk(email: string) {
    try {
      const userId = await this.getUserIdByEmail(email);
      
      // Get recent security events for risk assessment
      const recentEvents = await prisma.securityEvent.findMany({
        where: {
          userId,
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        },
        orderBy: {
          timestamp: 'desc'
        },
        take: 100
      });

      // Calculate risk score based on recent events
      const riskScore = this.calculateRiskScore(recentEvents);
      const riskLevel = this.calculateRiskLevel(riskScore);
      
      // Update user risk tier
      await this.updateUserRiskTier(userId, riskScore);

      // Log risk assessment event
      await this.logSecurityEvent(email, 'RISK_ASSESSMENT_CHANGED', {
        previousScore: 0,
        newScore: riskScore,
        factors: this.getRiskFactors(recentEvents)
      });

      return {
        success: true,
        data: {
          riskScore,
          riskLevel,
          factors: this.getRiskFactors(recentEvents),
          assessmentTime: new Date()
        }
      };
    } catch (error) {
      console.error('Risk assessment error:', error);
      return {
        success: false,
        error: {
          code: 'RISK_ASSESSMENT_FAILED',
          message: error instanceof Error ? error.message : 'Risk assessment failed'
        }
      };
    }
  }

  async getSecuritySummary(email: string) {
    try {
      const userId = await this.getUserIdByEmail(email);
      
      // Get user info with related data
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          devices: {
            where: { isActive: true }
          },
          authenticators: true,
          webauthnCredentials: true,
          smartCards: true,
          sessions: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });

      if (!user) {
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          }
        };
      }

      // Get recent security events
      const recentEvents = await prisma.securityEvent.findMany({
        where: {
          userId,
          timestamp: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        },
        orderBy: {
          timestamp: 'desc'
        },
        take: 20
      });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            riskTier: user.riskTier,
            isLocked: user.isLocked,
            createdAt: user.createdAt
          },
          devices: user.devices.map(device => ({
            id: device.id,
            deviceName: device.deviceName,
            deviceType: device.deviceType,
            trustLevel: device.trustLevel,
            lastSeenAt: device.lastSeenAt,
            riskScore: device.riskScore
          })),
          authenticators: user.authenticators.length,
          webauthnCredentials: user.webauthnCredentials.length,
          smartCards: user.smartCards.length,
          activeSessions: user.sessions.length,
          recentEvents: recentEvents.map(event => ({
            id: event.id,
            eventType: event.eventType,
            timestamp: event.timestamp,
            riskScore: event.riskScore,
            riskLevel: event.riskLevel
          }))
        }
      };
    } catch (error) {
      console.error('Security summary error:', error);
      return {
        success: false,
        error: {
          code: 'SECURITY_SUMMARY_FAILED',
          message: error instanceof Error ? error.message : 'Failed to get security summary'
        }
      };
    }
  }

  private async getUserIdByEmail(email: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user.id;
  }

  private calculateRiskScore(events: any[]): number {
    let score = 0;
    
    for (const event of events) {
      switch (event.eventType) {
        case 'LOGIN_FAILURE':
          score += 10;
          break;
        case 'LOGIN_MFA_FAILURE':
          score += 15;
          break;
        case 'DEVICE_REVOKED':
          score += 5;
          break;
        case 'RECOVERY_CODE_USED':
          score += 8;
          break;
        case 'CARD_DISABLED':
        case 'WEBAUTHN_DISABLED':
        case 'TOTP_DISABLED':
          score += 3;
          break;
        case 'LOGIN_SUCCESS':
        case 'LOGIN_MFA_SUCCESS':
          score -= 2;
          break;
        case 'DEVICE_REGISTERED':
        case 'TOTP_ENABLED':
        case 'WEBAUTHN_ENABLED':
        case 'CARD_ENABLED':
          score -= 1;
          break;
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  private calculateRiskLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (score <= 20) return 'LOW';
    if (score <= 50) return 'MEDIUM';
    if (score <= 80) return 'HIGH';
    return 'CRITICAL';
  }

  private async updateUserRiskTier(userId: string, riskScore: number) {
    const riskLevel = this.calculateRiskLevel(riskScore);
    let riskTier: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    
    if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
      riskTier = 'HIGH';
    } else if (riskLevel === 'MEDIUM') {
      riskTier = 'MEDIUM';
    }

    await prisma.user.update({
      where: { id: userId },
      data: { riskTier }
    });
  }

  private getRiskFactors(events: any[]): any[] {
    const factors = [];
    
    // Count different event types
    const eventCounts = events.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {});

    if (eventCounts['LOGIN_FAILURE'] > 3) {
      factors.push('Multiple failed login attempts');
    }
    
    if (eventCounts['LOGIN_MFA_FAILURE'] > 2) {
      factors.push('MFA verification failures');
    }
    
    if (eventCounts['DEVICE_REVOKED'] > 0) {
      factors.push('Device revocations');
    }
    
    if (eventCounts['RECOVERY_CODE_USED'] > 0) {
      factors.push('Recovery code usage');
    }

    return factors;
  }
}
