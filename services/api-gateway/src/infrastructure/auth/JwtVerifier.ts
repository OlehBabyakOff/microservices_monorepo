import jwt from 'jsonwebtoken';
import { TokenVerifier } from '../../domain/interfaces/TokenVerifier';

export class JwtVerifier implements TokenVerifier {
  constructor(private readonly publicKey: Buffer) {}

  verify(token: string) {
    return jwt.verify(token, this.publicKey, { algorithms: ['RS256'] });
  }
}

