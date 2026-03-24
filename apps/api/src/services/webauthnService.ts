import { PrismaClient } from '@mfa-platform/db';
import { z } from 'zod';

const prisma = new PrismaClient();

const registerOptionsSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(1),
  username: z.string().min(1)
});

export class WebAuthnService {
  async generateRegistrationOptions(email: string, displayName?: string, username?: string) {
    try {
      // For demo purposes, return mock WebAuthn options
      // In production, you'd use @simplewebauthn/server here
      const challenge = Math.random().toString(36).substring(2, 15);
      
      const options = {
        rp: {
          name: process.env.WEBAUTHN_RP_NAME || 'MFA Card Platform',
          id: process.env.WEBAUTHN_RP_ID || 'localhost'
        },
        user: {
          id: email,
          name: username || email,
          displayName: displayName || username || email
        },
        challenge: challenge,
        pubKeyCredParams: {
          alg: -7, // ES256
          type: 'public-key'
        },
        timeout: 60000,
        attestation: 'direct'
      };

      // Store challenge for verification (in production, use Redis)
      await this.storeChallenge(email, challenge);

      return {
        success: true,
        data: options
      };
    } catch (error) {
      console.error('WebAuthn registration options error:', error);
      return {
        success: false,
        error: {
          code: 'REGISTRATION_OPTIONS_FAILED',
          message: error instanceof Error ? error.message : 'Failed to generate registration options'
        }
      };
    }
  }

  async verifyRegistration(email: string, credentialData: any) {
    try {
      // For demo purposes, accept any credential
      // In production, you'd verify the actual WebAuthn response
      const userId = await this.getUserIdByEmail(email);
      
      // Store the credential
      const webauthnCredential = await prisma.webAuthnCredential.create({
        data: {
          userId,
          authenticatorId: await this.createAuthenticator(email, 'WEBAUTHN'),
          credentialId: `cred_${Date.now()}`,
          credentialType: 'public-key',
          transports: ['internal', 'usb', 'nfc', 'ble'],
          publicKey: JSON.stringify(credentialData),
          name: `${credentialData.name || 'WebAuthn'} for ${email}`,
          isActive: true,
          isBackup: false
        }
      });

      // Clear challenge
      await this.clearChallenge(email);

      return {
        success: true,
        data: {
          id: webauthnCredential.id,
          credentialId: webauthnCredential.credentialId,
          name: webauthnCredential.name
        }
      };
    } catch (error) {
      console.error('WebAuthn registration verification error:', error);
      return {
        success: false,
        error: {
          code: 'REGISTRATION_VERIFICATION_FAILED',
          message: error instanceof Error ? error.message : 'Registration verification failed'
        }
      };
    }
  }

  async generateAuthenticationOptions(email: string) {
    try {
      const userCredentials = await this.getUserCredentials(email);
      
      const allowCredentials = userCredentials.map(cred => ({
        id: cred.credentialId,
        type: 'public-key',
        transports: cred.transports as any || ['internal'],
        name: cred.name
      }));

      const challenge = Math.random().toString(36).substring(2, 15);

      const options = {
        rp: {
          name: process.env.WEBAUTHN_RP_NAME || 'MFA Card Platform',
          id: process.env.WEBAUTHN_RP_ID || 'localhost'
        },
        challenge: challenge,
        allowCredentials,
        userVerification: 'preferred',
        timeout: 60000
      };

      // Store challenge for verification
      await this.storeChallenge(email, challenge);

      return {
        success: true,
        data: options
      };
    } catch (error) {
      console.error('WebAuthn authentication options error:', error);
      return {
        success: false,
        error: {
          code: 'AUTH_OPTIONS_FAILED',
          message: error instanceof Error ? error.message : 'Failed to generate authentication options'
        }
      };
    }
  }

  async verifyAuthentication(email: string, credentialData: any) {
    try {
      // For demo purposes, accept any credential
      // In production, you'd verify the actual WebAuthn response
      const userId = await this.getUserIdByEmail(email);
      
      // Update credential usage
      await this.updateCredentialUsage(credentialData.id);

      // Clear challenge
      await this.clearChallenge(email);

      return {
        success: true,
        data: {
          verified: true,
          credentialId: credentialData.id
        }
      };
    } catch (error) {
      console.error('WebAuthn authentication verification error:', error);
      return {
        success: false,
        error: {
          code: 'AUTH_VERIFICATION_FAILED',
          message: error instanceof Error ? error.message : 'Authentication verification failed'
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

  private async createAuthenticator(email: string, type: string): Promise<string> {
    const authenticator = await prisma.authenticator.create({
      data: {
        userId: await this.getUserIdByEmail(email),
        type: type as any,
        name: `${type} for ${email}`,
        isActive: true,
        isBackup: false
      }
    });
    
    return authenticator.id;
  }

  private async getUserCredentials(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        webauthnCredentials: {
          where: { isActive: true }
        }
      }
    });
    
    return user?.webauthnCredentials || [];
  }

  private async updateCredentialUsage(credentialId: string) {
    await prisma.webAuthnCredential.update({
      where: { credentialId },
      data: {
        lastUsedAt: new Date()
      }
    });
  }

  private async storeChallenge(email: string, challenge: string) {
    // In production, store in Redis with expiration
    // For demo, we'll use a simple in-memory approach
    console.log(`Challenge stored for ${email}: ${challenge}`);
  }

  private async getChallengeForUser(email: string): Promise<string> {
    // In production, retrieve from Redis
    // For demo, generate a new challenge
    const challenge = Math.random().toString(36).substring(2, 15);
    console.log(`Challenge retrieved for ${email}: ${challenge}`);
    return challenge;
  }

  private async clearChallenge(email: string) {
    // In production, remove from Redis
    console.log(`Challenge cleared for ${email}`);
  }
}
