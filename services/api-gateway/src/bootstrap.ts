import { FileKeyProvider } from './infrastructure/auth/FileKeyProvider.js';
import { JwtVerifier } from './infrastructure/auth/jwt/JwtVerifier.js';
import { HttpServiceProxy } from './infrastructure/proxy/HttpProxyAdapter.js';
import { PinoLogger } from './infrastructure/logger/pino/Pino.js';
import { AuthMiddleware } from './presentation/http/middlewares/authMiddleware.js';
import { GatewayRouter } from './presentation/http/routes/gatewayRoutes.js';
import { createApp } from './presentation/http/app.js';
import { startServer } from './presentation/http/server.js';
import { VerifyJWT } from './application/use-cases/VerifyJwt.js';

import { ENV } from './shared/configs/env.js';

export function bootstrap() {
  // Provider
  const keyProvider = new FileKeyProvider();

  // Infrastructure
  const logger = new PinoLogger();
  const jwtVerifier = new JwtVerifier(keyProvider.getPublicKey());

  // Use-cases
  const verifyJwt = new VerifyJWT(jwtVerifier);

  // Middlewares
  const authMiddleware = new AuthMiddleware(verifyJwt);

  // Proxies
  const authProxy = new HttpServiceProxy(ENV.SERVICES.AUTH);
  const userProxy = new HttpServiceProxy(ENV.SERVICES.USER);

  const router = new GatewayRouter(authMiddleware, authProxy, userProxy).create();

  const app = createApp(router, logger);

  process.on('uncaughtException', (err) => {
    logger.fatal('Uncaught Exception', err as Error);

    process.exit(1);
  });

  process.on('unhandledRejection', (err) => {
    logger.fatal('Unhandled Rejection', err as Error);

    process.exit(1);
  });

  startServer(app, logger);
}

