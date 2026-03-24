import { PrismaClient } from '@mfa-platform/db';
import { authenticator } from 'otplib';
import * as speakeasy from 'speakeasy';
import { z } from 'zod';
import crypto, { randomBytes } from 'crypto';

const prisma = new PrismaClient();

interface TotpSecret {
  base32: string;
  ascii?: string;
  hex?: string;
}

interface GeneratedSecret {
  base32: string;
  ascii?: string;
  hex?: string;
}

// Extend the authenticator module to include our interface
declare module 'otplib' {
  export function generateSecret(): GeneratedSecret;
}

const setupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1)
});

const verifySchema = z.object({
  email: z.string().email(),
  token: z.string().min(6).max(6)
});

export class TotpService {
  async generateSecret(email: string, name?: string) {
    try {
      // Generate a random base32 secret
      const secretBytes = crypto.randomBytes(20);
      const base32Secret = secretBytes.toString('base64').replace(/[+/]/g, '').replace(/=/g, '');
      
      // Store the encrypted secret in database
      const encryptedSecret = this.encryptSecret(base32Secret);
      
      const totpSecret = await prisma.totpSecret.create({
        data: {
          userId: await this.getUserIdByEmail(email),
          secret: encryptedSecret,
          algorithm: 'SHA1',
          digits: 6,
          period: 30,
          name: name || `TOTP for ${email}`,
          isActive: true,
          isBackup: false,
          verificationCounter: 0
        }
      });

      // Generate QR code for easy setup
      const otpauthUrl = `otpauth://totp/${encodeURIComponent(email)}?secret=${base32Secret}&issuer=${encodeURIComponent(process.env.WEBAUTHN_RP_NAME || 'MFA Card Platform')}`;

      return {
        success: true,
        data: {
          id: totpSecret.id,
          secret: base32Secret,
          qrCode: otpauthUrl,
          name: totpSecret.name,
          backupCodes: await this.generateBackupCodes(email)
        }
      };
    } catch (error) {
      console.error('TOTP secret generation error:', error);
      return {
        success: false,
        error: {
          code: 'TOTP_GENERATION_FAILED',
          message: error instanceof Error ? error.message : 'Failed to generate TOTP secret'
        }
      };
    }
  }

  async verifyToken(email: string, token: string) {
    try {
      // Get user's TOTP secrets
      const userSecrets = await prisma.totpSecret.findMany({
        where: {
          user: { email },
          isActive: true
        },
        include: {
          user: true
        }
      });

      if (userSecrets.length === 0) {
        return {
          success: false,
          error: {
            code: 'TOTP_NOT_SETUP',
            message: 'TOTP not set up for this account'
          }
        };
      }

      // Try each secret until we find a match
      for (const totpSecret of userSecrets) {
        const decryptedSecret = this.decryptSecret(totpSecret.secret);
        
        const verified = speakeasy.totp.verify({
          secret: decryptedSecret,
          encoding: 'base32',
          token
        });

        if (verified) {
          // Update verification counter and last used time
          await prisma.totpSecret.update({
            where: { id: totpSecret.id },
            data: {
              lastUsedAt: new Date(),
              verificationCounter: totpSecret.verificationCounter + 1
            }
          });

          return {
            success: true,
            data: {
              verified: true,
              authenticatorId: totpSecret.id,
              name: totpSecret.name
            }
          };
        }
      }

      return {
        success: false,
        error: {
          code: 'TOTP_INVALID',
          message: 'Invalid TOTP token'
        }
      };
    } catch (error) {
      console.error('TOTP verification error:', error);
      return {
        success: false,
        error: {
          code: 'TOTP_VERIFICATION_FAILED',
          message: error instanceof Error ? error.message : 'TOTP verification failed'
        }
      };
    }
  }

  async generateBackupCodes(email: string, count: number = 10) {
    try {
      const codes = [];
      for (let i = 0; i < count; i++) {
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        codes.push(code);
      }

      // Store backup codes (in production, you'd hash these)
      const userId = await this.getUserIdByEmail(email);
      
      const batch = await prisma.recoveryCodeBatch.create({
        data: {
          userId,
          batchName: 'TOTP Backup Codes',
          codesGenerated: count,
          codesRemaining: count,
          isActive: true
        }
      });

      for (const code of codes) {
        await prisma.recoveryCode.create({
          data: {
            batchId: batch.id,
            codeHash: this.hashCode(code), // In production, use proper hashing
            isUsed: false
          }
        });
      }

      return codes;
    } catch (error) {
      console.error('Backup codes generation error:', error);
      return [];
    }
  }

  async getUserTotpSecrets(email: string) {
    try {
      const userSecrets = await prisma.totpSecret.findMany({
        where: {
          user: { email },
          isActive: true
        },
        select: {
          id: true,
          name: true,
          algorithm: true,
          digits: true,
          period: true,
          isActive: true,
          isBackup: true,
          lastUsedAt: true,
          verificationCounter: true,
          createdAt: true
        }
      });

      return userSecrets.map(secret => ({
        id: secret.id,
        name: secret.name,
        algorithm: secret.algorithm,
        digits: secret.digits,
        period: secret.period,
        isActive: secret.isActive,
        isBackup: secret.isBackup,
        lastUsedAt: secret.lastUsedAt,
        verificationCounter: secret.verificationCounter,
        createdAt: secret.createdAt
      }));
    } catch (error) {
      console.error('Get TOTP secrets error:', error);
      return [];
    }
  }

  async deleteTotpSecret(id: string, email: string) {
    try {
      await prisma.totpSecret.update({
        where: { 
          id,
          user: { email }
        },
        data: { isActive: false }
      });

      return {
        success: true,
        message: 'TOTP secret deleted successfully'
      };
    } catch (error) {
      console.error('TOTP deletion error:', error);
      return {
        success: false,
        error: {
          code: 'TOTP_DELETION_FAILED',
          message: error instanceof Error ? error.message : 'Failed to delete TOTP secret'
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

  private encryptSecret(secret: string): string {
    // In production, use proper encryption
    // For demo purposes, we'll use base64 encoding
    return Buffer.from(secret).toString('base64');
  }

  private decryptSecret(encryptedSecret: string): string {
    // In production, use proper decryption
    // For demo purposes, we'll use base64 decoding
    return Buffer.from(encryptedSecret, 'base64').toString();
  }

  private hashCode(code: string): string {
    // In production, use proper hashing (bcrypt, scrypt, etc.)
    // For demo purposes, we'll use simple hash
    return crypto.createHash('sha256').update(code).digest('hex');
  }

  private async storeChallenge(email: string, challenge: string): Promise<void> {
    // In production, store in Redis with expiration
    // For demo, we'll use a simple in-memory approach
    console.log(`Challenge stored for ${email}: ${challenge}`);
  }
}
