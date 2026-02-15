import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { jwtAuth } from '../middlewares/auth.js';
import { SERVICES } from '../constants/services.js';

const router = express.Router();

router.use(
  '/auth',
  createProxyMiddleware({
    target: SERVICES.AUTH,
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '' },
  }),
);

router.use(
  '/user',
  jwtAuth,
  createProxyMiddleware({
    target: SERVICES.USER,
    changeOrigin: true,
    pathRewrite: { '^/api/user': '' },
  }),
);

export default router;

