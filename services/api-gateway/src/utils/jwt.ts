import jwt from 'jsonwebtoken';
import fs from 'fs';

export function verifyJWT(token: string, publicKeyPath: string): jwt.JwtPayload | string {
  if (!token || !publicKeyPath) {
    throw new Error('Token or Public key path are missing!');
  }

  const publicKey = fs.readFileSync(publicKeyPath);

  return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
}

