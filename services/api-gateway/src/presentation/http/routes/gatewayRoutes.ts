import express, { Router } from 'express';

import { IAuthMiddleware } from '../../http/interfaces/AuthMiddleware.js';
import { IServiceProxy } from '../../http/interfaces/ServiceProxy.js';

export class GatewayRouter {
  constructor(
    private readonly authMiddleware: IAuthMiddleware,
    private readonly authProxy: IServiceProxy,
    private readonly userProxy: IServiceProxy,
  ) {}

  create(): Router {
    const router = express.Router();

    router.use('/auth', this.authProxy.getHandler());
    router.use('/users', this.authMiddleware.handle, this.userProxy.getHandler());

    return router;
  }
}

