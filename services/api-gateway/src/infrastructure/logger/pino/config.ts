import os from 'os';
import pino from 'pino';

import { ENV } from '../../../shared/configs/env.js';

const isDev = ENV.NODE_ENV === ENV.ENVIRONMENTS.DEVELOPMENT;

export const PinoConfig = {
  level: isDev ? ENV.LOG_LEVELS.DEBUG : ENV.LOG_LEVELS.INFO,
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    service: ENV.SERVICE_NAME,
    env: ENV.NODE_ENV,
    pid: process.pid,
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

