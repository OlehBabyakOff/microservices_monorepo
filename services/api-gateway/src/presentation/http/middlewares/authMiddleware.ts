import { Request, Response, NextFunction } from 'express';

import { IAuthMiddleware } from '../../http/interfaces/AuthMiddleware.js';

import { VerifyToken } from '../../../application/use-cases/VerifyToken.js';

import { HttpError } from '../errors/HttpErrors.js';

export class AuthMiddleware implements IAuthMiddleware {
  constructor(private readonly verifyToken: VerifyToken) {}

  handle = (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw HttpError.UNAUTHORIZED('Authorization header is missing');
      }

      if (!authHeader.startsWith('Bearer')) {
        throw HttpError.UNAUTHORIZED('Invalid authorization header format');
      }

      const token = authHeader.split(' ')[1];

      const payload = this.verifyToken.execute(token);

      req.user = payload;

      next();
    } catch (error) {
      next(error);
    }
  };
}

