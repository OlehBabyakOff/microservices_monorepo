import express, { Router, Express } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { errorHandler } from '../middlewares/errorMiddleware.js';
import { ENV } from '../../shared/configs/env.js';

export function createApp(router: Router): Express {
  const app = express();

  app.use(helmet());

  app.use(
    cors({
      origin: ENV.CORS_ORIGIN,
      credentials: true,
    }),
  );

  app.use(express.json({ strict: false, limit: '50mb' }));
  app.use(express.urlencoded({ extended: false, limit: '50mb' }));

  app.use(cookieParser());

  app.use(compression());

  app.use('/api', router);

  app.use(errorHandler);

  return app;
}

