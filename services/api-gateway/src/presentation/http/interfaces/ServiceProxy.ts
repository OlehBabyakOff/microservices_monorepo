import { RequestHandler } from 'express';

export interface IServiceProxy {
  getHandler(): RequestHandler;
}

