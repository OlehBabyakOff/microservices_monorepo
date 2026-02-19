import type { Express } from 'express';

import { ILogger } from '../../infrastructure/interfaces/Logger.js';

import { ENV } from '../../shared/configs/env.js';

export function startServer(app: Express, logger: ILogger) {
  const server = app.listen(ENV.PORT, () => {
    logger.info(`Worker ${process.pid} running on port ${ENV.PORT} \n`);
  });

  const shutdown = (signal: 'SIGTERM' | 'SIGINT') => {
    logger.info(`Worker ${process.pid} ${signal}`);

    server.close(() => process.exit(0));
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('SIGINT', () => shutdown('SIGINT'));
}

