import cluster from 'cluster';
import os from 'os';

import { bootstrap } from './bootstrap.js';
import { PinoLogger } from './infrastructure/logger/pino/Pino.js';

import { ENV } from './shared/configs/env.js';

const cpuCount = os.availableParallelism();
const logger = new PinoLogger();

if (ENV.CLUSTER && cluster.isPrimary) {
  logger.info(`Primary ${process.pid} is running\n`);
  logger.info(`Forking ${cpuCount} workers\n`);

  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  let isShuttingDown = false;

  cluster.on('exit', (worker, code, signal) => {
    logger.info(
      `Worker ${worker.process.pid} exited with code ${code} and signal ${signal}. Starting a new worker.\n`,
    );

    if (!isShuttingDown) {
      cluster.fork();
    }
  });

  const shutdown = (signal: 'SIGTERM' | 'SIGINT') => {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;

    logger.info(`Primary ${signal}`);

    for (const id in cluster.workers) {
      cluster.workers[id]?.kill(`${signal}`);
    }

    cluster.disconnect(() => process.exit(0));
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('SIGINT', () => shutdown('SIGINT'));
} else {
  bootstrap();
}

