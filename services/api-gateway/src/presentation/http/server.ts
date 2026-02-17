import type { Express } from 'express';
import { ENV } from '../../shared/configs/env.js';

export function startServer(app: Express) {
  const server = app.listen(ENV.PORT, () => {
    console.log(`Worker ${process.pid} running on port ${ENV.PORT} \n`);
  });

  const shutdown = (signal: 'SIGTERM' | 'SIGINT') => {
    console.log(`Worker ${process.pid} ${signal}`);

    server.close(() => process.exit(0));
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('SIGINT', () => shutdown('SIGINT'));
}

