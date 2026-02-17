import express, { Router } from 'express';

import { AuthMiddleware } from '../interfaces/AuthMiddleware';
import { ServiceProxy } from '../interfaces/ServiceProxy';

export class GatewayRouter {
  constructor(
    private readonly authMiddleware: AuthMiddleware,
    private readonly authProxy: ServiceProxy,
    private readonly userProxy: ServiceProxy,
  ) {}

  create(): Router {
    const router = express.Router();

    router.use('/auth', this.authProxy.getHandler());
    router.use('/users', this.authMiddleware.handle, this.userProxy.getHandler());

    return router;
  }
}

