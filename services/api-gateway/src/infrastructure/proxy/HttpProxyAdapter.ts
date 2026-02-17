import { createProxyMiddleware, Options } from 'http-proxy-middleware';

import { ServiceProxy } from '../../presentation/interfaces/ServiceProxy';
import { RequestHandler } from 'express';

export class HttpServiceProxy implements ServiceProxy {
  private handler: RequestHandler;

  constructor(
    target: string,
    changeOrigin: Options['changeOrigin'] = true,
    pathRewrite?: Options['pathRewrite'],
  ) {
    this.handler = createProxyMiddleware({
      target,
      changeOrigin,
      pathRewrite,
    });
  }

  getHandler(): RequestHandler {
    return this.handler;
  }
}

