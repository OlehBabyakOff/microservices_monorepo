import { createProxyMiddleware, Options, RequestHandler } from 'http-proxy-middleware';
import { IncomingMessage, ServerResponse } from 'http';

import { Logger } from '@libs/logger';

import { IServiceProxy } from '../../presentation/http/interfaces/ServiceProxy.js';

import { createCircuitBreaker, CircuitBreakerType } from '../resilience/CircuitBreakerWrapper.js';
import { InfrastructureError } from '../errors/InfrastructureError.js';
import { SERVICES_NAMES } from '../../shared/constants/services.js';

export class HttpServiceProxy implements IServiceProxy {
  private handler: RequestHandler;
  private circuitBreaker: CircuitBreakerType;

  constructor(
    target: string,
    logger: Logger,
    changeOrigin: Options['changeOrigin'] = true,
    pathRewrite?: Options['pathRewrite'],
  ) {
    const proxy = createProxyMiddleware({
      target,
      changeOrigin,
      pathRewrite,
      on: {
        error(err: Error) {
          logger.error(`Error in proxying request to ${target}`, err);
        },
      },
    });

    this.circuitBreaker = createCircuitBreaker(
      (req: IncomingMessage, res: ServerResponse) =>
        new Promise<void>((resolve, reject) => {
          proxy(req as IncomingMessage, res as ServerResponse, (error) => {
            if (error) {
              return reject(error);
            }

            resolve();
          });
        }),
      target,
      logger,
    );

    this.circuitBreaker.fallback(() => {
      throw InfrastructureError.SERVICE_UNAVAILABLE(SERVICES_NAMES[target]);
    });

    this.handler = ((req, res, next) => {
      this.circuitBreaker.fire(req, res).catch(next);
    }) as RequestHandler;
  }

  getHandler(): RequestHandler {
    return this.handler;
  }
}

