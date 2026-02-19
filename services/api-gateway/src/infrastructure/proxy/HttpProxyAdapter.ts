import { createProxyMiddleware, Options, RequestHandler } from 'http-proxy-middleware';

import { IServiceProxy } from '../../presentation/http/interfaces/ServiceProxy';
import { ILogger } from '../interfaces/Logger';

import { InfrastructureError } from '../errors/InfrastructureError';
import { SERVICES_NAMES } from '../../shared/constants/services';

export class HttpServiceProxy implements IServiceProxy {
  private handler: RequestHandler;

  constructor(
    target: string,
    logger: ILogger,
    changeOrigin: Options['changeOrigin'] = true,
    pathRewrite?: Options['pathRewrite'],
  ) {
    this.handler = createProxyMiddleware({
      target,
      changeOrigin,
      pathRewrite,
      on: {
        error(err, req: any) {
          logger.error(`Error in proxying request to ${target}`, err);

          req.next(InfrastructureError.SERVICE_UNAVAILABLE(SERVICES_NAMES[target]));
        },
      },
    });
  }

  getHandler(): RequestHandler {
    return this.handler;
  }
}

