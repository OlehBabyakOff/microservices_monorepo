import { IErrorPayload } from '../../../shared/interfaces/ErrorPayload.js';

import { BaseError } from '../../../shared/errors/BaseError.js';
import { HTTP_ERRORS } from '../../../shared/constants/errors.js';

export class HttpError extends BaseError {
  constructor(statusCode: number, status: string, payload: IErrorPayload = {}) {
    super(statusCode, status, payload);
  }

  static UNAUTHORIZED(message?: string) {
    return new this(HTTP_ERRORS.UNAUTHORIZED.statusCode, HTTP_ERRORS.UNAUTHORIZED.status, {
      message,
      contextFn: this.UNAUTHORIZED,
    });
  }
}

