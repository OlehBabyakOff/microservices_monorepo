import 'dotenv/config';

function parseBoolean(value?: string): boolean {
  return value === 'true';
}

function parseNumber(value: string | undefined, defaultValue: number): number {
  if (!value) {
    return defaultValue;
  }

  const num = Number(value);

  if (Number.isNaN(num)) {
    throw new Error(`Invalid env value: ${value}`);
  }

  return num;
}

function parseCors(origin?: string): string[] | '*' {
  if (!origin) {
    return '*';
  }

  return origin.split(',').map((o) => o.trim());
}

const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};

export const ENV = {
  ENVIRONMENTS,
  NODE_ENV: process.env.NODE_ENV ?? ENVIRONMENTS.DEVELOPMENT,
  SERVICE_NAME: process.env.SERVICE_NAME || 'API GATEWAY',
  PORT: parseNumber(process.env.PORT, 3000),
  CLUSTER: parseBoolean(process.env.CLUSTER),

  CORS_ORIGIN: parseCors(process.env.CORS_ORIGIN),

  SERVICES: {
    API_GATEWAY: process.env.API_GATEWAY_URL || 'http://localhost:3000',
    AUTH: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    USER: process.env.USER_SERVICE_URL || 'http://localhost:3002',
  },

  REDIS: {
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: parseNumber(process.env.REDIS_PORT, 6379),
    USER: process.env.REDIS_USER || '',
    PASSWORD: process.env.REDIS_PASSWORD || '',
    KEY_PREFIX: process.env.REDIS_KEY_PREFIX || 'api-gateway:',
    MAX_RETRIES_PER_REQUEST: parseNumber(process.env.REDIS_MAX_RETRIES_PER_REQUEST, 2),
    ENABLE_OFFLINE_QUEUE: parseBoolean(process.env.REDIS_ENABLE_OFFLINE_QUEUE),
    CONNECT_TIMEOUT: parseNumber(process.env.REDIS_CONNECT_TIMEOUT, 5000),
    COMMAND_TIMEOUT: parseNumber(process.env.REDIS_COMMAND_TIMEOUT, 3000),
  },

  LOG_LEVELS: {
    TRACE: 'trace',
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
    FATAL: 'fatal',
  },
};

