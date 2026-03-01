import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';

import { Logger } from '@libs/logger';

export function requestLogger(logger: Logger) {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime.bigint();

    res.on('finish', () => {
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1000000;

      const statusColor = (status: number) => {
        if (status >= 500) {
          return chalk.red(status);
        }

        if (status >= 400) {
          return chalk.yellow(status);
        }

        if (status >= 300) {
          return chalk.cyan(status);
        }

        if (status >= 200) {
          return chalk.green(status);
        }

        return chalk.white(status);
      };

      const methodColor = (method: string) => {
        switch (method) {
          case 'GET':
            return chalk.blue(method);
          case 'POST':
            return chalk.green(method);
          case 'PUT':
            return chalk.yellow(method);
          case 'PATCH':
            return chalk.yellowBright();
          case 'DELETE':
            return chalk.red(method);
          default:
            return chalk.white(method);
        }
      };

      logger.info(
        `${methodColor(req.method)} ${req.originalUrl} ${statusColor(res.statusCode)} ${chalk.magenta(
          durationMs.toFixed(2) + 'ms',
        )} - pid:${process.pid}`,
      );
    });

    next();
  };
}

