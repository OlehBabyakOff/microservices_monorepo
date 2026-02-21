import { RedisType } from '../db/Redis';

import { ISlidingWindowRateLimit } from '../interfaces/SlidingWindowRateLimit.js';

import { InfrastructureError } from '../errors/InfrastructureError.js';

export class SlidingWindowRateLimit implements ISlidingWindowRateLimit {
  private readonly windowMs: number;
  private readonly maxRequests: number;
  private readonly prefix: string;

  constructor(
    private readonly redisClient: RedisType,
    windowSec?: number,
    maxRequests?: number,
    prefix?: string,
  ) {
    this.windowMs = (windowSec || 60) * 1000;
    this.maxRequests = maxRequests || 100;
    this.prefix = prefix || 'rate_limit';

    this.defineLuaCommand();
  }

  private defineLuaCommand() {
    this.redisClient.defineCommand('slidingWindow', {
      numberOfKeys: 1,
      lua: `
        local key = KEYS[1]
        local window_size = tonumber(ARGV[1])
        local max_requests = tonumber(ARGV[2])
        local now = tonumber(ARGV[3])
        local request_id = ARGV[4]

        local window_start = now - window_size

        -- Memory leak protection: remove expired entries
        redis.call('ZREMRANGEBYSCORE', key, '-inf', window_start)

        local current_count = redis.call('ZCARD', key)

        -- Optional safety cap against abuse
        if current_count > max_requests * 2 then
            redis.call('ZREMRANGEBYRANK', key, 0, current_count - max_requests)
            current_count = redis.call('ZCARD', key)
        end

        if current_count >= max_requests then
            local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
            local retry_after = 0

            if #oldest > 0 then
                retry_after = math.ceil(
                    (tonumber(oldest[2]) + window_size - now) / 1000
                )
            end

            return {0, current_count, retry_after}
        end

        redis.call('ZADD', key, now, request_id)

        -- TTL cleanup for inactive users
        redis.call('PEXPIRE', key, window_size)

        return {1, current_count + 1, 0}
      `,
    });
  }

  async isAllowed(key: string): Promise<{
    allowed: boolean;
    limit: number;
    remaining: number;
    retryAfter: number;
    resetAt: number;
  }> {
    const keyName = `${this.prefix}:${key}`;
    const now = Date.now();
    const requestId = `${now}-${Math.random().toString(36).slice(2, 10)}`;

    try {
      const result: [number, number, number] = await (this.redisClient as any).slidingWindow(
        keyName,
        this.windowMs,
        this.maxRequests,
        now,
        requestId,
      );

      const [allowed, currentCount, retryAfter] = result;

      const isAllowed = allowed === 1;

      return {
        allowed: isAllowed,
        limit: this.maxRequests,
        remaining: Math.max(0, this.maxRequests - currentCount),
        retryAfter,
        resetAt: Math.floor(Date.now() / 1000) + retryAfter,
      };
    } catch (error) {
      throw InfrastructureError.RATE_LIMIT_ERROR((error as Error).message);
    }
  }
}

