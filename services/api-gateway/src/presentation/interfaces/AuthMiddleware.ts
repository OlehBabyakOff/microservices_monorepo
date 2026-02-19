import type { Request, Response, NextFunction } from 'express';

export interface AuthMiddleware {
  handle(req: Request, res: Response, next: NextFunction): void;
}

