import { PrismaClient } from '@mfa-platform/db';
import { z } from 'zod';
import crypto from 'crypto';

const prisma = new PrismaClient();

const registerCardSchema = z.object({
  email: z.string().email(),
  cardAid: z.string().min(1),
  cardName: z.string().min(1)
});

const authenticateCardSchema = z.object({
  email: z.string().email(),
  cardId: z.string().min(1),
  challenge: z.string().min(1)
});

export class SmartCardService {
  async registerCard(email: string, cardAid: string, cardName?: string) {
    try {
      // Generate a unique card ID
      const cardId = crypto.randomBytes(16).toString('hex');
      
      // Generate a key pair for the card
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      });

      // Store the card in database
      const smartCard = await prisma.smartCard.create({
        data: {
          userId: await this.getUserIdByEmail(email),
          cardId,
          cardAid,
          publicKey: publicKey.toString(),
          cardVersion: '1.0',
          manufacturer: 'Demo Card Manufacturer',
          serialNumber: crypto.randomBytes(8).toString('hex'),
          isActive: true,
          isBackup: false,
          usageCounter: 0
        }
      });

      return {
        success: true,
        data: {
          id: smartCard.id,
          cardId: smartCard.cardId,
          cardAid: smartCard.cardAid,
          publicKey: smartCard.publicKey,
          name: smartCard.manufacturer,
          serialNumber: smartCard.serialNumber
        }
      };
    } catch (error) {
      console.error('Smart card registration error:', error);
      return {
        success: false,
        error: {
          code: 'CARD_REGISTRATION_FAILED',
          message: error instanceof Error ? error.message : 'Failed to register smart card'
        }
      };
    }
  }

  async generateChallenge(email: string, cardId: string) {
    try {
      // Generate a random challenge for the card
      const challenge = crypto.randomBytes(32).toString('hex');
      
      // Store challenge for verification (in production, use Redis)
      await this.storeChallenge(email, cardId, challenge);

      return {
        success: true,
        data: {
          challenge,
          cardId,
          timeout: 60000 // 60 seconds
        }
      };
    } catch (error) {
      console.error('Smart card challenge generation error:', error);
      return {
        success: false,
        error: {
          code: 'CARD_CHALLENGE_FAILED',
          message: error instanceof Error ? error.message : 'Failed to generate card challenge'
        }
      };
    }
  }

  async verifyCard(email: string, cardId: string, challenge: string, response: string) {
    try {
      // Get the card from database
      const card = await prisma.smartCard.findFirst({
        where: {
          user: { email },
          cardId,
          isActive: true
        }
      });

      if (!card) {
        return {
          success: false,
          error: {
            code: 'CARD_NOT_FOUND',
            message: 'Smart card not found'
          }
        };
      }

      // Verify the response (this is a simplified demo verification)
      // In production, you'd use proper cryptographic verification
      const isValid = this.verifyCardResponse(challenge, response);

      if (isValid) {
        // Update card usage
        await prisma.smartCard.update({
          where: { id: card.id },
          data: {
            lastUsedAt: new Date(),
            usageCounter: card.usageCounter + 1
          }
        });

        // Clear challenge
        await this.clearChallenge(email, cardId);

        return {
          success: true,
          data: {
            verified: true,
            cardId: card.cardId,
            name: card.manufacturer
          }
        };
      } else {
        return {
          success: false,
          error: {
            code: 'CARD_VERIFICATION_FAILED',
            message: 'Invalid card response'
          }
        };
      }
    } catch (error) {
      console.error('Smart card verification error:', error);
      return {
        success: false,
        error: {
          code: 'CARD_VERIFICATION_ERROR',
          message: error instanceof Error ? error.message : 'Card verification failed'
        }
      };
    }
  }

  async getUserCards(email: string) {
    try {
      const cards = await prisma.smartCard.findMany({
        where: {
          user: { email },
          isActive: true
        },
        select: {
          id: true,
          cardId: true,
          cardAid: true,
          cardVersion: true,
          manufacturer: true,
          serialNumber: true,
          isActive: true,
          isBackup: true,
          lastUsedAt: true,
          usageCounter: true,
          createdAt: true
        }
      });

      return cards.map(card => ({
        id: card.id,
        cardId: card.cardId,
        cardAid: card.cardAid,
        cardVersion: card.cardVersion,
        manufacturer: card.manufacturer,
        serialNumber: card.serialNumber,
        isActive: card.isActive,
        isBackup: card.isBackup,
        lastUsedAt: card.lastUsedAt,
        usageCounter: card.usageCounter,
        createdAt: card.createdAt
      }));
    } catch (error) {
      console.error('Get smart cards error:', error);
      return [];
    }
  }

  async deleteCard(cardId: string, email: string) {
    try {
      await prisma.smartCard.update({
        where: { 
          cardId,
          user: { email }
        },
        data: { isActive: false }
      });

      return {
        success: true,
        message: 'Smart card deleted successfully'
      };
    } catch (error) {
      console.error('Smart card deletion error:', error);
      return {
        success: false,
        error: {
          code: 'CARD_DELETION_FAILED',
          message: error instanceof Error ? error.message : 'Failed to delete smart card'
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

  private verifyCardResponse(challenge: string, response: string): boolean {
    // Simplified verification for demo purposes
    // In production, you'd use proper cryptographic verification
    // This is just a placeholder that checks if response is not empty
    return response && response.length > 0;
  }

  private async storeChallenge(email: string, cardId: string, challenge: string): Promise<void> {
    // In production, store in Redis with expiration
    // For demo, we'll use a simple in-memory approach
    console.log(`Challenge stored for ${email}:${cardId}: ${challenge}`);
  }

  private async getChallengeForCard(email: string, cardId: string): Promise<string> {
    // In production, retrieve from Redis
    // For demo, generate a new challenge
    const challenge = crypto.randomBytes(32).toString('hex');
    console.log(`Challenge retrieved for ${email}:${cardId}: ${challenge}`);
    return challenge;
  }

  private async clearChallenge(email: string, cardId: string): Promise<void> {
    // In production, remove from Redis
    // For demo, we'll just log it
    console.log(`Challenge cleared for ${email}:${cardId}`);
  }
}
