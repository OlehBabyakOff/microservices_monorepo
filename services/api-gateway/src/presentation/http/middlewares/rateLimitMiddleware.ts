import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

import { ILogger } from '../../../infrastructure/interfaces/Logger.js';
import { IRateLimit } from '../../../infrastructure/interfaces/RateLimit.js';

export function rateLimit(limiter: IRateLimit, logger: ILogger) {
  const keyGenerator = (req: Request): string => {
    const ip = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.ip;

    const userAgent = req.headers['user-agent'];

    const rawKey = `${userAgent}-${ip}`;

    return crypto.createHash('sha256').update(rawKey).digest('hex');
  };

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = keyGenerator(req);

      const result = await limiter.isAllowed(key);

      res.set({
        'RateLimit-Limit': String(result.limit),
        'RateLimit-Remaining': String(result.remaining),
        'RateLimit-Reset': String(result.resetAt),

        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.resetAt),
      });

      if (!result.allowed) {
        res.set('Retry-After', String(result.retryAfter));

        logger.warn('Rate limit exceeded', {
          ip: key,
          path: req.originalUrl,
          method: req.method,
        });

        return res.status(429).json({
          error: 'Too Many Requests',
        });
      }

      next();
    } catch (error) {
      logger.error('Rate limit error', error as Error, {
        ip: req.ip,
        path: req.originalUrl,
      });

      next(error);
    }
  };
}

