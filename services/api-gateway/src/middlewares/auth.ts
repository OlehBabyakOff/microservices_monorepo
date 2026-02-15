import type { Request, Response, NextFunction } from 'express';

import { fromRoot } from '../utils/paths.js';
import { verifyJWT } from '../utils/jwt.js';

const publicKeyPath = fromRoot('keys', 'public.pem');

export function jwtAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const payload = verifyJWT(token, publicKeyPath);

    req.user = payload;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

