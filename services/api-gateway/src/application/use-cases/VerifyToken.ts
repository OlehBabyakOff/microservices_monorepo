import { ITokenVerifier } from '../../domain/interfaces/TokenVerifier.js';

import { ApplicationError } from '../errors/ApplicationError.js';

export class VerifyToken {
  constructor(private readonly tokenVerifier: ITokenVerifier) {}

  execute(token: string) {
    if (!token) {
      throw ApplicationError.MISSING_TOKEN('No token provided');
    }

    try {
      return this.tokenVerifier.verify(token);
    } catch (error) {
      throw ApplicationError.INVALID_TOKEN('Invalid token');
    }
  }
}

