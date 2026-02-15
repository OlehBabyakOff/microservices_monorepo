import 'dotenv/config';

const corsOrigin = process.env.CORS_ORIGIN;

export default {
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLUSTER: process.env.CLUSTER === 'true' || false,
  PORT: process.env.PORT || 3000,

  CORS_ORIGIN: corsOrigin ? corsOrigin.split(',') : '*',

  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  USER_SERVICE_URL: process.env.USER_SERVICE_URL || 'http://localhost:3002',
};

