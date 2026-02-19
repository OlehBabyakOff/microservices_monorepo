import express, { Response, Router, Express } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';

import { errorHandler } from '../middlewares/errorMiddleware.js';
import { ENV } from '../../shared/configs/env.js';

import { ILogger } from '../../infrastructure/interfaces/Logger.js';

export function createApp(router: Router, logger: ILogger): Express {
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

  if (ENV.NODE_ENV === ENV.ENVIRONMENTS.DEVELOPMENT) {
    // app.use(
    //   pinoHttp({
    //     logger,
    //     customLogLevel: (res: Response, err) => {
    //       if (res.statusCode >= 500) {
    //         return 'error';
    //       }
    //       if (res.statusCode >= 400) {
    //         return 'warn';
    //       }
    //       return 'info';
    //     },
    //   }),
    // );
  }

  app.use('/api', router);

  app.use(errorHandler);

  return app;
}

