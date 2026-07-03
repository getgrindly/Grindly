import { RedisService } from './redis.service';

export function Cacheable(ttl: number = 3600, keyPrefix?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: any, ...args: any[]) {
      const redisService = this.redisService as RedisService;

      if (!redisService?.isConnected()) {
        return originalMethod.apply(this, args);
      }

      const cacheKey = keyPrefix
        ? `${keyPrefix}:${JSON.stringify(args)}`
        : `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;

      try {
        const cachedValue = await redisService.get(cacheKey);
        if (cachedValue !== null) {
          return cachedValue;
        }
      } catch (error) {
        // Silently fail and proceed to fetch fresh data
      }

      const result = await originalMethod.apply(this, args);

      try {
        await redisService.set(cacheKey, result, ttl);
      } catch (error) {
        // Silently fail cache write
      }

      return result;
    };

    return descriptor;
  };
}
