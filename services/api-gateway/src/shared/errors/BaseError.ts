export interface IErrorPayload {
  message?: string;
  contextFn?: Function;
}

export class BaseError extends Error {
  public readonly statusCode: number;
  public readonly status: string;

  constructor(statusCode: number, status: string, payload: IErrorPayload) {
    super();

    this.name = this.constructor.name;

    this.statusCode = statusCode;
    this.status = status;

    const { message, contextFn = this.constructor } = payload;

    Error.captureStackTrace(this, contextFn);

    this.message = message || status;
  }
}

