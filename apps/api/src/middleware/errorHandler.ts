import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ApiResponse, ErrorCode } from '@mfa-platform/shared';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const response: ApiResponse = {
    success: false,
    error: {
      code: error.code || ErrorCode.INTERNAL_ERROR,
      message: error.message || 'Internal server error',
      details: (error as any).details,
    },
    meta: {
      requestId: request.id,
      timestamp: new Date().toISOString(),
    },
  };

  if (error.validation) {
    response.error!.code = ErrorCode.VALIDATION_ERROR;
    response.error!.message = 'Validation failed';
    response.error!.details = error.validation;
    return reply.status(400).send(response);
  }

  const statusCode = error.statusCode || 500;
  
  request.log.error(error);

  reply.status(statusCode).send(response);
}
