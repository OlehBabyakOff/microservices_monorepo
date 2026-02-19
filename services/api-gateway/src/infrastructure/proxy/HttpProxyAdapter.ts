import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { RequestHandler } from 'express';

import { IServiceProxy } from '../../presentation/http/interfaces/ServiceProxy';

export class HttpServiceProxy implements IServiceProxy {
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

