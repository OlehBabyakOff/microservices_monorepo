import { Express } from 'express';

import { Logger } from '@libs/logger';

import { RedisType } from '../../infrastructure/db/Redis.js';

import { ENV } from '../../shared/configs/env.js';

export function startServer(app: Express, redis: RedisType, logger: Logger): void {
  const server = app.listen(ENV.PORT, () => {
    logger.info(`Worker ${process.pid} running on port ${ENV.PORT}`);
  });

  const shutdown = async (signal: 'SIGTERM' | 'SIGINT') => {
    logger.info(`Worker ${process.pid}: ${signal}`);

    server.close(async () => {
      try {
        await redis.quit();

        logger.info('Redis connection closed');
      } catch (error) {
        logger.error('Redis disconnect error', error as Error);
      }

      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('SIGINT', () => shutdown('SIGINT'));
}

