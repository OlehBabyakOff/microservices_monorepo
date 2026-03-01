import cluster from 'cluster';
import os from 'os';

import { bootstrap } from './bootstrap.js';
import { PinoLogger, createPinoConfig } from '@libs/pino';

import { ENV } from './shared/configs/env.js';

const cpuCount = os.availableParallelism();

const logger = new PinoLogger(
  createPinoConfig({
    level:
      ENV.NODE_ENV === ENV.ENVIRONMENTS.DEVELOPMENT ? ENV.LOG_LEVELS.DEBUG : ENV.LOG_LEVELS.INFO,
    service: ENV.SERVICE_NAME,
    env: ENV.NODE_ENV,
    pid: process.pid,
    pretty: ENV.NODE_ENV === ENV.ENVIRONMENTS.DEVELOPMENT,
  }),
);

async function startWorker(): Promise<void> {
  try {
    await bootstrap();
  } catch (error) {
    logger.fatal('Worker bootstrap error', error as Error);

    process.exit(1);
  }
}

if (ENV.CLUSTER && cluster.isPrimary) {
  logger.info(`Primary ${process.pid} is running`);
  logger.info(`Forking ${cpuCount} workers`);

  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.info(
      `Worker ${worker.process.pid} exited with code ${code} and signal ${signal}. Starting a new worker.`,
    );

    cluster.fork();
  });

  const shutdown = (signal: 'SIGTERM' | 'SIGINT') => {
    logger.info(`Primary ${signal}`);

    cluster.disconnect(() => process.exit(0));
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('SIGINT', () => shutdown('SIGINT'));
} else {
  startWorker();
}

