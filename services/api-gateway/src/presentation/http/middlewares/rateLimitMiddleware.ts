import { Request, Response, NextFunction } from 'express';

import { ILogger } from '../../../infrastructure/interfaces/Logger';
import { ISlidingWindowRateLimit } from '../../../infrastructure/interfaces/SlidingWindowRateLimit';

export function rateLimit(limiter: ISlidingWindowRateLimit, logger: ILogger) {
  const keyGenerator = (req: Request): string => {
    const forwarded = req.headers['x-forwarded-for'];

    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }

    return req.ip as string;
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

