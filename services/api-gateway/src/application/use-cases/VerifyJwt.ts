import { TokenVerifier } from '../../domain/interfaces/TokenVerifier';
import { ApplicationError } from '../errors/ApplicationError';

export class VerifyJWT {
  constructor(private readonly tokenVerifier: TokenVerifier) {}

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

