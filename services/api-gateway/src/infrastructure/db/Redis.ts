import Redis from 'ioredis';

import { Logger } from '@libs/pino';
import { IRedisClient } from '../interfaces/Redis.js';

import { ENV } from '../../shared/configs/env.js';

export class RedisClient implements IRedisClient {
  private static instance: Redis;
  private client: Redis;

  constructor(private readonly logger: Logger) {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis({
        host: ENV.REDIS.HOST,
        port: ENV.REDIS.PORT,
        username: ENV.REDIS.USER,
        password: ENV.REDIS.PASSWORD,

        lazyConnect: true,
        keyPrefix: ENV.REDIS.KEY_PREFIX,

        maxRetriesPerRequest: ENV.REDIS.MAX_RETRIES_PER_REQUEST,
        enableOfflineQueue: ENV.REDIS.ENABLE_OFFLINE_QUEUE,
        connectTimeout: ENV.REDIS.CONNECT_TIMEOUT,
        commandTimeout: ENV.REDIS.COMMAND_TIMEOUT,

        retryStrategy: (times) => {
          if (times > 10) {
            return null;
          }

          return Math.min(times * 100, 2000);
        },

        reconnectOnError: (err) => {
          const targetErrors = ['READONLY', 'ETIMEDOUT', 'ECONNRESET'];

          return targetErrors.some((e) => err.message.includes(e));
        },
      });

      RedisClient.instance.on('error', (err) => this.logger.error('Redis error', err));
      RedisClient.instance.on('close', () => this.logger.warn('Redis connection closed'));
      RedisClient.instance.on('reconnecting', () => this.logger.warn('Redis reconnecting'));
    }

    this.client = RedisClient.instance;
  }

  async connect(): Promise<void> {
    if (this.client.status !== 'ready') {
      await this.client.connect();

      this.logger.info(
        `Redis client connected on: ${this.client.options.host}:${this.client.options.port}`,
      );
    }
  }

  async disconnect(): Promise<void> {
    await this.client.quit();

    this.logger.info('Redis client disconnected');
  }

  getClient(): Redis {
    return this.client;
  }
}

export type RedisType = InstanceType<typeof Redis>;

