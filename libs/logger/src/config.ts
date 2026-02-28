import os from 'os';
import pino, { LoggerOptions } from 'pino';

import { LoggerConfigOption } from './logger.interface';

export function createPinoConfig(options: LoggerConfigOption): LoggerOptions {
  const isDev = options.pretty ?? false;

  return {
    level: options.level,
    timestamp: pino.stdTimeFunctions.isoTime,
    base: {
      service: options.service,
      env: options.env,
      pid: options.pid,
      hostname: os.hostname(),
    },
    transport: isDev
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            levelFirst: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss o',
            ignore: 'pid,hostname,env,service',
          },
        }
      : undefined, // no transport in prod, write logs to stdout
  };
}

