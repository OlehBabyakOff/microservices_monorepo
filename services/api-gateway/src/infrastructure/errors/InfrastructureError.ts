import { IErrorPayload } from '../../shared/interfaces/ErrorPayload';

import { ENV } from '../../shared/configs/env';
import { BaseError } from '../../shared/errors/BaseError';
import { INFRASTRUCTURE_ERRORS } from '../../shared/constants/errors';

export class InfrastructureError extends BaseError {
  constructor(statusCode: number, status: string, payload: IErrorPayload = {}) {
    super(statusCode, status, payload);
  }

  static SERVICE_UNAVAILABLE(serviceName?: string) {
    return new this(
      INFRASTRUCTURE_ERRORS.SERVICE_UNAVAILABLE.statusCode,
      INFRASTRUCTURE_ERRORS.SERVICE_UNAVAILABLE.status,
      {
        message: `${serviceName || 'Service'} is unavailable`,
        contextFn: this.SERVICE_UNAVAILABLE,
      },
    );
  }

  static RATE_LIMIT_ERROR(errorMessage?: string) {
    return new this(
      INFRASTRUCTURE_ERRORS.RATE_LIMIT_ERROR.statusCode,
      INFRASTRUCTURE_ERRORS.RATE_LIMIT_ERROR.status,
      {
        message: errorMessage || 'Rate limit error occurred',
        contextFn: this.RATE_LIMIT_ERROR,
      },
    );
  }
}

