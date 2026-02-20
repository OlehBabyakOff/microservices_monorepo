import { RedisClient } from './infrastructure/db/Redis.js';
import { FileKeyProvider } from './infrastructure/auth/FileKeyProvider.js';
import { JwtVerifier } from './infrastructure/auth/jwt/JwtVerifier.js';
import { HttpServiceProxy } from './infrastructure/proxy/HttpProxyAdapter.js';
import { PinoLogger } from './infrastructure/logger/pino/Pino.js';
import { SlidingWindowRateLimit } from './infrastructure/resilience/SlidingWindowRateLimit.js';
import { AuthMiddleware } from './presentation/http/middlewares/authMiddleware.js';
import { GatewayRouter } from './presentation/http/routes/gatewayRoutes.js';
import { createApp } from './presentation/http/app.js';
import { startServer } from './presentation/http/server.js';
import { VerifyToken } from './application/use-cases/VerifyToken.js';

import { ENV } from './shared/configs/env.js';

export async function bootstrap(): Promise<void> {
  const logger = new PinoLogger();

  try {
    // Provider
    const keyProvider = new FileKeyProvider();

    // Infrastructure
    const redisClient = new RedisClient(logger);
    redisClient.connect();

    const redis = redisClient.getClient();

    const jwtVerifier = new JwtVerifier(keyProvider.getPublicKey());
    const limiter = new SlidingWindowRateLimit(redis);

    // Use-cases
    const verifyToken = new VerifyToken(jwtVerifier);

    // Middlewares
    const authMiddleware = new AuthMiddleware(verifyToken);

    // Proxies
    const authProxy = new HttpServiceProxy(ENV.SERVICES.AUTH, logger);
    const userProxy = new HttpServiceProxy(ENV.SERVICES.USER, logger);

    const router = new GatewayRouter(authMiddleware, authProxy, userProxy).create();

    const app = createApp(router, limiter, logger);

    process.on('uncaughtException', (err) => {
      logger.fatal('Uncaught Exception', err as Error);

      process.exit(1);
    });

    process.on('unhandledRejection', (err) => {
      logger.fatal('Unhandled Rejection', err as Error);

      process.exit(1);
    });

    startServer(app, redis, logger);
  } catch (error) {
    logger.fatal('Bootstrap error', error as Error);

    process.exit(1);
  }
}

