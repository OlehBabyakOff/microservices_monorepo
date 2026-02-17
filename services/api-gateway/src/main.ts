import cluster from 'cluster';
import os from 'os';

import { bootstrap } from './bootstrap.js';
import { ENV } from './shared/configs/env.js';

const cpuCount = os.availableParallelism();

if (ENV.CLUSTER && cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running\n`);
  console.log(`Forking ${cpuCount} workers\n`);

  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  let isShuttingDown = false;

  cluster.on('exit', (worker, code, signal) => {
    console.log(
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

    console.log(`Primary ${signal}`);

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

