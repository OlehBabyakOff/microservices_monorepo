import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { jwtAuth } from '../middlewares/auth.js';
import configs from '../configs/index.js';

const router = express.Router();

router.use(
  '/auth',
  createProxyMiddleware({
    target: configs.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '' },
  }),
);

router.use(
  '/user',
  jwtAuth,
  createProxyMiddleware({
    target: configs.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/user': '' },
  }),
);

export default router;

