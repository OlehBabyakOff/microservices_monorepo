import express, { Router } from 'express';

import { IAuthMiddleware } from '../interfaces/AuthMiddleware';
import { IServiceProxy } from '../interfaces/ServiceProxy';

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

