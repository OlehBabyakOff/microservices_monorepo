import { TokenVerifier } from '../../domain/interfaces/TokenVerifier';

export class VerifyJWT {
  constructor(private readonly tokenVerifier: TokenVerifier) {}

  execute(token: string) {
    if (!token) {
      throw new Error('Token is required!');
    }

    return this.tokenVerifier.verify(token);
  }
}

