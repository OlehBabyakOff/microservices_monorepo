import type { Request, Response, NextFunction } from 'express';
import { AuthMiddleware as IAuthMiddleware } from '../interfaces/AuthMiddleware';

import { VerifyJWT } from '../../application/use-cases/VerifyJwt';

export class AuthMiddleware implements IAuthMiddleware {
  constructor(private readonly verifyJWT: VerifyJWT) {}

  handle = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const payload = this.verifyJWT.execute(token);

      req.user = payload;

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
}

