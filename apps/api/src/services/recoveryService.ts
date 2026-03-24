import { PrismaClient } from '@mfa-platform/db';
import { z } from 'zod';
import crypto from 'crypto';

const prisma = new PrismaClient();

const generateCodesSchema = z.object({
  email: z.string().email(),
  count: z.number().min(1).max(20).optional()
});

const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6).max(12)
});

export class RecoveryService {
  async generateRecoveryCodes(email: string, count: number = 10) {
    try {
      const userId = await this.getUserIdByEmail(email);
      
      // Generate new recovery codes
      const codes = [];
      for (let i = 0; i < count; i++) {
        const code = crypto.randomBytes(4).toString('hex').toUpperCase();
        codes.push(code);
      }

      // Create a new batch
      const batch = await prisma.recoveryCodeBatch.create({
        data: {
          userId,
          batchName: `Recovery Codes ${new Date().toISOString()}`,
          codesGenerated: count,
          codesRemaining: count,
          isActive: true
        }
      });

      // Store individual codes (hashed in production)
      for (const code of codes) {
        await prisma.recoveryCode.create({
          data: {
            batchId: batch.id,
            codeHash: this.hashCode(code), // In production, use proper hashing
            isUsed: false
          }
        });
      }

      return {
        success: true,
        data: {
          batchId: batch.id,
          codes: codes, // Return plaintext codes for demo
          codesGenerated: count,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
        }
      };
    } catch (error) {
      console.error('Recovery codes generation error:', error);
      return {
        success: false,
        error: {
          code: 'RECOVERY_CODES_GENERATION_FAILED',
          message: error instanceof Error ? error.message : 'Failed to generate recovery codes'
        }
      };
    }
  }

  async verifyRecoveryCode(email: string, code: string) {
    try {
      // Get user's active recovery codes
      const userBatches = await prisma.recoveryCodeBatch.findMany({
        where: {
          user: { email },
          isActive: true
        },
        include: {
          recoveryCodes: {
            where: { isUsed: false }
          }
        }
      });

      if (userBatches.length === 0) {
        return {
          success: false,
          error: {
            code: 'RECOVERY_CODES_NOT_FOUND',
            message: 'No recovery codes available for this account'
          }
        };
      }

      // Check each code in all active batches
      for (const batch of userBatches) {
        for (const recoveryCode of batch.recoveryCodes) {
          if (this.verifyCodeHash(code, recoveryCode.codeHash)) {
            // Mark code as used
            await prisma.recoveryCode.update({
              where: { id: recoveryCode.id },
              data: {
                isUsed: true,
                usedAt: new Date()
              }
            });

            // Update batch count
            await prisma.recoveryCodeBatch.update({
              where: { id: batch.id },
              data: {
                codesRemaining: Math.max(0, batch.codesRemaining - 1)
              }
            });

            // Create a temporary session for recovery
            const sessionToken = crypto.randomBytes(32).toString('hex');
            const session = await prisma.session.create({
              data: {
                userId: await this.getUserIdByEmail(email),
                token: sessionToken,
                sessionType: 'RECOVERY',
                trustLevel: 'RECOVERY',
                expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
                requiresReauth: true
              }
            });

            return {
              success: true,
              data: {
                verified: true,
                batchId: batch.id,
                codeId: recoveryCode.id,
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
          }
        }
      }

      return {
        success: false,
        error: {
          code: 'RECOVERY_CODE_INVALID',
          message: 'Invalid recovery code'
        }
      };
    } catch (error) {
      console.error('Recovery code verification error:', error);
      return {
        success: false,
        error: {
          code: 'RECOVERY_CODE_VERIFICATION_FAILED',
          message: error instanceof Error ? error.message : 'Recovery code verification failed'
        }
      };
    }
  }

  async getRecoveryCodeBatches(email: string) {
    try {
      const batches = await prisma.recoveryCodeBatch.findMany({
        where: {
          user: { email },
          isActive: true
        },
        include: {
          recoveryCodes: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return batches.map(batch => ({
        id: batch.id,
        batchName: batch.batchName,
        codesGenerated: batch.codesGenerated,
        codesRemaining: batch.codesRemaining,
        isActive: batch.isActive,
        createdAt: batch.createdAt,
        recoveryCodes: batch.recoveryCodes.map(code => ({
          id: code.id,
          isUsed: code.isUsed,
          usedAt: code.usedAt
        }))
      }));
    } catch (error) {
      console.error('Get recovery code batches error:', error);
      return [];
    }
  }

  async revokeRecoveryBatch(batchId: string, email: string) {
    try {
      await prisma.recoveryCodeBatch.update({
        where: { 
          id: batchId,
          user: { email }
        },
        data: { isActive: false }
      });

      return {
        success: true,
        message: 'Recovery code batch revoked successfully'
      };
    } catch (error) {
      console.error('Revoke recovery batch error:', error);
      return {
        success: false,
        error: {
          code: 'RECOVERY_BATCH_REVOKE_FAILED',
          message: error instanceof Error ? error.message : 'Failed to revoke recovery batch'
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

  private hashCode(code: string): string {
    // In production, use proper hashing (bcrypt, scrypt, etc.)
    // For demo purposes, we'll use simple hash
    return crypto.createHash('sha256').update(code).digest('hex');
  }

  private verifyCodeHash(code: string, hashedCode: string): boolean {
    const codeHash = this.hashCode(code);
    return codeHash === hashedCode;
  }
}
