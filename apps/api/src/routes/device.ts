import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DeviceService } from '../services/deviceService';

const deviceService = new DeviceService();

export async function deviceRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const result = await deviceService.registerDevice(
        body.email,
        body.deviceName,
        body.deviceType,
        request.headers['user-agent']
      );
      return reply.code(result.success ? 201 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'DEVICE_REGISTER_ERROR',
          message: 'Failed to register device'
        }
      });
    }
  });

  fastify.get('/list', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = request.query as any;
      const result = await deviceService.getUserDevices(query.email);
      return reply.code(200).send({
        success: true,
        data: result
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'DEVICE_LIST_ERROR',
          message: 'Failed to get devices'
        }
      });
    }
  });

  fastify.put('/:deviceId/trust', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = request.params as any;
      const body = request.body as any;
      const result = await deviceService.updateDeviceTrust(
        body.email,
        params.deviceId,
        body.trustLevel,
        body.deviceName
      );
      return reply.code(result.success ? 200 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'DEVICE_TRUST_ERROR',
          message: 'Failed to update device trust'
        }
      });
    }
  });

  fastify.delete('/:deviceId/revoke', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = request.params as any;
      const body = request.body as any;
      const result = await deviceService.revokeDevice(
        body.email,
        params.deviceId
      );
      return reply.code(result.success ? 200 : 400).send(result);
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'DEVICE_REVOKE_ERROR',
          message: 'Failed to revoke device'
        }
      });
    }
  });

  fastify.put('/:deviceId/activity', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = request.params as any;
      const body = request.body as any;
      await deviceService.updateDeviceActivity(
        params.deviceId,
        body.riskScore
      );
      
      return reply.code(200).send({
        success: true,
        message: 'Device activity updated successfully'
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'DEVICE_ACTIVITY_ERROR',
          message: 'Failed to update device activity'
        }
      });
    }
  });
}
