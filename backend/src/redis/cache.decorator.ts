import { RedisService } from './redis.service';

export function Cacheable(ttl: number = 3600, keyPrefix?: string): any {
  return function (
    target: any, 
    propertyKey: string | symbol, 
    descriptor: PropertyDescriptor // Changed from TypedPropertyDescriptor<any>
  ) {
    const originalMethod = descriptor.value;

    if (!originalMethod) {
      return descriptor;
    }

    descriptor.value = async function (this: any, ...args: any[]) {
      const redisService = this.redisService as RedisService;

      // Note: Ensure your controller/service class has `constructor(private readonly redisService: RedisService)`
      if (!redisService?.isConnected()) {
        return originalMethod.apply(this, args);
      }

      const keyName = typeof propertyKey === 'symbol' ? propertyKey.description : propertyKey;
      const cacheKey = keyPrefix
        ? `${keyPrefix}:${JSON.stringify(args)}`
        : `${target.constructor.name}:${keyName}:${JSON.stringify(args)}`;

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
