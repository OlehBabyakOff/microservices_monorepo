import { Request, Response, NextFunction } from 'express';

import { IAuthMiddleware } from '../../http/interfaces/AuthMiddleware';

import { VerifyJWT } from '../../../application/use-cases/VerifyJwt';

import { HttpError } from '../errors/HttpErrors';

export class AuthMiddleware implements IAuthMiddleware {
  constructor(private readonly verifyJWT: VerifyJWT) {}

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

      const payload = this.verifyJWT.execute(token);

      req.user = payload;

      next();
    } catch (error) {
      next(error);
    }
  };
}

