import cluster from 'cluster';
import os from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import configs from './configs/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const cpuCount = os.availableParallelism();
const isDev = configs.NODE_ENV !== 'production';

if (cluster.isPrimary) {
  const workerFile = isDev ? join(__dirname, 'server.ts') : join(__dirname, '../dist/server.js');
  console.log(workerFile);

  cluster.setupPrimary({
    exec: workerFile,
    execArgv: process.execArgv,
  });

  console.log(`Primary ${process.pid} is running`);
  console.log(`Forking ${cpuCount} workers\n`);

  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  let isShuttingDown = false;

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} exited with code ${code} and signal ${signal}. Starting a new worker...`,
    );

    if (!isShuttingDown) {
      cluster.fork();
    }
  });

  process.on('SIGTERM', () => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log('Primary SIGTERM');

    cluster.disconnect(() => process.exit(0));
  });

  process.on('SIGINT', () => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log('Primary SIGINT');

    cluster.disconnect(() => process.exit(0));
  });
}

