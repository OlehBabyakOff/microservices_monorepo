import os from 'os';
import express, { Response, Router, Express } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { Logger } from '@libs/logger';

import { ENV } from '../../shared/configs/env.js';

import { errorHandler } from './middlewares/errorMiddleware.js';
import { requestLogger } from './middlewares/reqLoggerMiddleware.js';
import { requestId } from './middlewares/reqIdMiddleware.js';

export function createApp(router: Router, logger: Logger): Express {
  const app = express();

  app.set('trust proxy', true);

  app.use(requestId());

  app.use(helmet());

  app.use(
    cors({
      origin: ENV.CORS_ORIGIN,
      credentials: true,
    }),
  );

  app.use(express.json({ strict: false, limit: '5mb' }));
  app.use(express.urlencoded({ extended: false, limit: '5mb' }));

  app.use(cookieParser());

  app.use(compression({ threshold: 1024 }));

  if (ENV.NODE_ENV === ENV.ENVIRONMENTS.DEVELOPMENT) {
    app.use(requestLogger(logger));
  }

  app.get('/health', (_, res: Response) =>
    res
      .status(200)
      .json({ status: 'ok', hostname: os.hostname(), timestamp: new Date().toISOString() }),
  );

  app.use('/api', router);

  app.use(errorHandler(logger));

  return app;
}

