export interface ISlidingWindowRateLimit {
  isAllowed(key: string): Promise<{
    allowed: boolean;
    limit: number;
    remaining: number;
    retryAfter: number;
    resetAt: number;
  }>;
}

