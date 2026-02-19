import { Request, Response, NextFunction } from 'express';

import { ILogger } from 'services/api-gateway/src/infrastructure/interfaces/Logger';

import { BaseError } from '../../../shared/errors/BaseError';
import { INTERNAL_ERRORS } from '../../../shared/constants/errors';

export function errorHandler(logger: ILogger) {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof BaseError) {
      return res.status(err.statusCode).json({
        error: {
          status: err.status,
          message: err.message,
        },
      });
    }

    logger.error('Unhandled error:', err);

    return res.status(INTERNAL_ERRORS.INTERNAL_SERVER_ERROR.statusCode).json({
      error: {
        status: INTERNAL_ERRORS.INTERNAL_SERVER_ERROR.status,
        message: INTERNAL_ERRORS.INTERNAL_SERVER_ERROR.message,
      },
    });
  };
}

