import jwt from 'jsonwebtoken';
import { ITokenVerifier } from '../../domain/interfaces/TokenVerifier';

export class JwtVerifier implements ITokenVerifier {
  constructor(private readonly publicKey: Buffer) {}

  verify(token: string) {
    return jwt.verify(token, this.publicKey, { algorithms: ['RS256'] });
  }
}

