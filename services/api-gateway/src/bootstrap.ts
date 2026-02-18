import { FileKeyProvider } from './infrastructure/auth/FileKeyProvider.js';
import { JwtVerifier } from './infrastructure/auth/JwtVerifier.js';
import { HttpServiceProxy } from './infrastructure/proxy/HttpProxyAdapter.js';
import { AuthMiddleware } from './presentation/middlewares/authMiddleware.js';
import { GatewayRouter } from './presentation/routes/gatewayRoutes.js';
import { createApp } from './presentation/http/app.js';
import { startServer } from './presentation/http/server.js';
import { VerifyJWT } from './application/use-cases/VerifyJwt.js';

import { ENV } from './shared/configs/env.js';

export function bootstrap() {
  // Provider
  const keyProvider = new FileKeyProvider();

  // Infrastructure
  const jwtVerifier = new JwtVerifier(keyProvider.getPublicKey());

  // Use-cases
  const verifyJwt = new VerifyJWT(jwtVerifier);

  // Middlewares
  const authMiddleware = new AuthMiddleware(verifyJwt);

  // Proxies
  const authProxy = new HttpServiceProxy(ENV.SERVICES.AUTH);
  const userProxy = new HttpServiceProxy(ENV.SERVICES.USER);

  const router = new GatewayRouter(authMiddleware, authProxy, userProxy).create();

  const app = createApp(router);

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);

    process.exit(1);
  });

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);

    process.exit(1);
  });

  startServer(app);
}

