export interface Logger {
  info(message: string, meta?: Record<string, unknown>): void;
  debug(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  trace(message: string, meta?: Record<string, unknown>): void;
  error(message: string, error?: Error, meta?: Record<string, unknown>): void;
  fatal(message: string, error?: Error, meta?: Record<string, unknown>): void;
}

export interface LoggerConfigOption {
  level: string;
  service: string;
  env: string;
  pid?: number;
  pretty?: boolean;
}

