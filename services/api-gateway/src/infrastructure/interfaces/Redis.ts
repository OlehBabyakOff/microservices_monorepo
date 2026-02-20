import Redis from 'ioredis';

export interface IRedisClient {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getClient(): Redis;
}

