import CircuitBreaker from 'opossum';

import { ILogger } from '../interfaces/Logger';

export function createCircuitBreaker<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  target: string,
  logger: ILogger,
  options = {},
) {
  const breaker = new CircuitBreaker(fn, {
    timeout: 5000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000,
    name: `CircuitBreaker for ${target}`,
    ...options,
  });

  breaker.on('open', () => logger.warn(`Circuit breaker opened for ${target}`));
  breaker.on('halfOpen', () => logger.info(`Circuit breaker half-open for ${target}`));
  breaker.on('close', () => logger.info(`Circuit breaker closed for ${target}`));

  return breaker;
}

export type CircuitBreakerType = InstanceType<typeof CircuitBreaker>;

