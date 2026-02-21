import { IErrorPayload } from '../../shared/interfaces/ErrorPayload.js';

import { BaseError } from '../../shared/errors/BaseError.js';
import { APPLICATION_ERRORS } from '../../shared/constants/errors.js';

export class ApplicationError extends BaseError {
  constructor(statusCode: number, status: string, payload: IErrorPayload = {}) {
    super(statusCode, status, payload);
  }

  static MISSING_TOKEN(message?: string) {
    return new this(
      APPLICATION_ERRORS.MISSING_TOKEN.statusCode,
      APPLICATION_ERRORS.MISSING_TOKEN.status,
      { message, contextFn: this.MISSING_TOKEN },
    );
  }

  static INVALID_TOKEN(message?: string) {
    return new this(
      APPLICATION_ERRORS.INVALID_TOKEN.statusCode,
      APPLICATION_ERRORS.INVALID_TOKEN.status,
      { message, contextFn: this.INVALID_TOKEN },
    );
  }
}

