import type { Request, Response, NextFunction } from 'express';

export interface RequestHandler {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}

