import crypto from 'crypto';

import { Request, Response, NextFunction } from 'express';

export function requestId() {
  return (req: Request & { id?: string }, res: Response, next: NextFunction) => {
    req.id = crypto.randomUUID();

    res.setHeader('X-Request-Id', req.id);

    next();
  };
}

