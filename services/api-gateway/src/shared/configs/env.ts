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

export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parseNumber(process.env.PORT, 3000),
  CLUSTER: parseBoolean(process.env.CLUSTER),

  CORS_ORIGIN: parseCors(process.env.CORS_ORIGIN),

  SERVICES: {
    AUTH: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    USER: process.env.USER_SERVICE_URL || 'http://localhost:3002',
  },
};

