import pino, { Logger, LoggerOptions } from 'pino';

import { ILogger } from '../../interfaces/Logger';

import { PinoConfig } from './config';

export class PinoLogger implements ILogger {
  private logger: Logger;

  constructor(options?: LoggerOptions) {
    this.logger = pino({
      ...PinoConfig,
      ...options,
    });
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(meta, message);
  }
  debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(meta, message);
  }
  warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(meta, message);
  }
  trace(message: string, meta?: Record<string, unknown>): void {
    this.logger.trace(meta, message);
  }
  error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    this.logger.error(error ? { err: error, ...meta } : meta, message);
  }
  fatal(message: string, error?: Error, meta?: Record<string, unknown>): void {
    this.logger.fatal(error ? { err: error, ...meta } : meta, message);
  }
}

