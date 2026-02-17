import type { RequestHandler } from 'express';

export interface ServiceProxy {
  getHandler(): RequestHandler;
}

