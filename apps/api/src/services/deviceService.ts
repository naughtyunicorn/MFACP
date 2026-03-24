import { PrismaClient } from '@mfa-platform/db';
import { z } from 'zod';
import crypto from 'crypto';

const prisma = new PrismaClient();

const registerDeviceSchema = z.object({
  email: z.string().email(),
  deviceName: z.string().min(1),
  deviceType: z.enum(['WEB', 'MOBILE', 'DESKTOP'])
});

const updateDeviceSchema = z.object({
  email: z.string().email(),
  deviceId: z.string().min(1),
  deviceName: z.string().min(1).optional(),
  trustLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional()
});

export class DeviceService {
  async registerDevice(email: string, deviceName: string, deviceType: 'WEB' | 'MOBILE' | 'DESKTOP', userAgent?: string) {
    try {
      const userId = await this.getUserIdByEmail(email);
      
      // Generate a unique device ID
      const deviceId = crypto.randomBytes(16).toString('hex');
      
      // Parse user agent for device info
      const deviceInfo = this.parseUserAgent(userAgent || '');
      
      const device = await prisma.device.create({
        data: {
          userId,
          deviceId,
          deviceName,
          deviceType,
          platform: deviceInfo.platform,
          browser: deviceInfo.browser,
          version: deviceInfo.version,
          isActive: true,
          isTrusted: false,
          trustLevel: 'LOW',
          lastSeenAt: new Date(),
          riskScore: 0
        }
      });

      return {
        success: true,
        data: {
          id: device.id,
          deviceId: device.deviceId,
          deviceName: device.deviceName,
          deviceType: device.deviceType,
          platform: device.platform,
          browser: device.browser,
          trustLevel: device.trustLevel,
          isActive: device.isActive,
          lastSeenAt: device.lastSeenAt
        }
      };
    } catch (error) {
      console.error('Device registration error:', error);
      return {
        success: false,
        error: {
          code: 'DEVICE_REGISTRATION_FAILED',
          message: error instanceof Error ? error.message : 'Failed to register device'
        }
      };
    }
  }

  async getUserDevices(email: string) {
    try {
      const devices = await prisma.device.findMany({
        where: {
          user: { email },
          isActive: true
        },
        include: {
          authenticators: true,
          webauthnCredentials: true,
          smartCards: true
        },
        orderBy: {
          lastSeenAt: 'desc'
        }
      });

      return devices.map(device => ({
        id: device.id,
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        deviceType: device.deviceType,
        platform: device.platform,
        browser: device.browser,
        version: device.version,
        isActive: device.isActive,
        isTrusted: device.isTrusted,
        trustLevel: device.trustLevel,
        lastSeenAt: device.lastSeenAt,
        riskScore: device.riskScore,
        authenticators: device.authenticators,
        webauthnCredentials: device.webauthnCredentials,
        smartCards: device.smartCards,
        createdAt: device.createdAt
      }));
    } catch (error) {
      console.error('Get user devices error:', error);
      return [];
    }
  }

  async updateDeviceTrust(email: string, deviceId: string, trustLevel: 'LOW' | 'MEDIUM' | 'HIGH', deviceName?: string) {
    try {
      const device = await prisma.device.findFirst({
        where: {
          deviceId,
          user: { email },
          isActive: true
        }
      });

      if (!device) {
        return {
          success: false,
          error: {
            code: 'DEVICE_NOT_FOUND',
            message: 'Device not found'
          }
        };
      }

      const updateData: any = {
        trustLevel,
        isTrusted: trustLevel !== 'LOW'
      };

      if (deviceName) {
        updateData.deviceName = deviceName;
      }

      await prisma.device.update({
        where: { id: device.id },
        data: updateData
      });

      return {
        success: true,
        data: {
          id: device.id,
          deviceId: device.deviceId,
          trustLevel: device.trustLevel,
          isTrusted: updateData.isTrusted,
          deviceName: device.deviceName || device.deviceName
        }
      };
    } catch (error) {
      console.error('Update device trust error:', error);
      return {
        success: false,
        error: {
          code: 'DEVICE_UPDATE_FAILED',
          message: error instanceof Error ? error.message : 'Failed to update device'
        }
      };
    }
  }

  async revokeDevice(email: string, deviceId: string) {
    try {
      await prisma.device.update({
        where: { 
          deviceId,
          user: { email }
        },
        data: { isActive: false }
      });

      return {
        success: true,
        message: 'Device revoked successfully'
      };
    } catch (error) {
      console.error('Device revocation error:', error);
      return {
        success: false,
        error: {
          code: 'DEVICE_REVOKE_FAILED',
          message: error instanceof Error ? error.message : 'Failed to revoke device'
        }
      };
    }
  }

  async updateDeviceActivity(deviceId: string, riskScore: number = 0) {
    try {
      await prisma.device.update({
        where: { deviceId },
        data: {
          lastSeenAt: new Date(),
          riskScore: Math.max(0, riskScore)
        }
      });
    } catch (error) {
      console.error('Update device activity error:', error);
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

  private parseUserAgent(userAgent: string): { platform: string; browser: string; version: string } {
    // Simple user agent parsing for demo purposes
    // In production, you'd use a proper user agent parser library
    const ua = userAgent.toLowerCase();
    
    let platform = 'Unknown';
    let browser = 'Unknown';
    let version = 'Unknown';

    if (ua.includes('mobile') || ua.includes('android') || ua.includes('ios')) {
      platform = 'Mobile';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      platform = 'Tablet';
    } else if (ua.includes('windows')) {
      platform = 'Windows';
    } else if (ua.includes('mac') || ua.includes('os x')) {
      platform = 'macOS';
    } else if (ua.includes('linux')) {
      platform = 'Linux';
    }

    if (ua.includes('chrome')) {
      browser = 'Chrome';
      const match = ua.match(/chrome\/(\d+\.\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (ua.includes('firefox')) {
      browser = 'Firefox';
      const match = ua.match(/firefox\/(\d+\.\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (ua.includes('safari')) {
      browser = 'Safari';
      const match = ua.match(/safari\/(\d+\.\d+)/);
      version = match ? match[1] : 'Unknown';
    }

    return { platform, browser, version };
  }
}
