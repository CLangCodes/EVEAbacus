import Redis from 'ioredis';
import { logger } from './logger';

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

class RedisCacheService {
  private redis: Redis;
  private prefix: string;

  constructor() {
    // Use environment variables or default to your Redis config
    const host = process.env.REDIS_HOST || '192.168.50.174';
    const port = parseInt(process.env.REDIS_PORT || '6379');
    const password = process.env.REDIS_PASSWORD || 'MisfitInit4!4';
    const db = parseInt(process.env.REDIS_DB || '0');

    this.prefix = process.env.REDIS_PREFIX || 'eve-abacus:';
    
    this.redis = new Redis({
      host,
      port,
      password,
      db,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.redis.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    this.redis.on('error', (error: Error) => {
      logger.error('Redis connection error', { error: error.message });
    });

    this.redis.on('ready', () => {
      logger.info('Redis is ready');
    });
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(this.getKey(key));
      if (value) {
        logger.debug('Cache hit', { metadata: { key } });
        return JSON.parse(value);
      }
      logger.debug('Cache miss', { metadata: { key } });
      return null;
    } catch (error) {
      logger.error('Redis get error', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: { key }
      });
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      const fullKey = this.getKey(key);
      
      if (ttl) {
        await this.redis.setex(fullKey, ttl, serializedValue);
      } else {
        await this.redis.set(fullKey, serializedValue);
      }
      
      logger.debug('Cache set', { metadata: { key, ttl } });
    } catch (error) {
      logger.error('Redis set error', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: { key }
      });
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(this.getKey(key));
      logger.debug('Cache deleted', { metadata: { key } });
    } catch (error) {
      logger.error('Redis delete error', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: { key }
      });
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(this.getKey(key));
      return result === 1;
    } catch (error) {
      logger.error('Redis exists error', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: { key }
      });
      return false;
    }
  }

  async flush(pattern?: string): Promise<void> {
    try {
      const searchPattern = pattern ? `${this.prefix}${pattern}` : `${this.prefix}*`;
      const keys = await this.redis.keys(searchPattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        logger.info('Cache flushed', { metadata: { pattern, keysCount: keys.length } });
      }
    } catch (error) {
      logger.error('Redis flush error', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: { pattern }
      });
    }
  }

  async getStats(): Promise<{
    connected: boolean;
    memory: Record<string, string>;
    info: Record<string, string>;
  }> {
    try {
      const info = await this.redis.info();
      const memory = await this.redis.info('memory');
      
      return {
        connected: this.redis.status === 'ready',
        memory: this.parseRedisInfo(memory),
        info: this.parseRedisInfo(info),
      };
    } catch (error) {
      logger.error('Redis stats error', { error: error instanceof Error ? error.message : 'Unknown error' });
      return {
        connected: false,
        memory: {},
        info: {},
      };
    }
  }

  private parseRedisInfo(info: string): Record<string, string> {
    const lines = info.split('\r\n');
    const result: Record<string, string> = {};
    
    for (const line of lines) {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        if (key && value) {
          result[key] = value;
        }
      }
    }
    
    return result;
  }

  // Cache decorator for API responses
  async withCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const { ttl = 300, prefix = '' } = options;
    const cacheKey = prefix ? `${prefix}:${key}` : key;

    // Try to get from cache first
    const cached = await this.get<T>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // If not in cache, fetch and store
    const data = await fetcher();
    await this.set(cacheKey, data, ttl);
    
    return data;
  }

  // Generate cache keys
  generateKey(prefix: string, params: Record<string, unknown>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    
    return `${prefix}:${sortedParams}`;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch (error) {
      logger.error('Redis health check failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      return false;
    }
  }

  // Close connection
  async close(): Promise<void> {
    try {
      await this.redis.quit();
      logger.info('Redis connection closed');
    } catch (error) {
      logger.error('Redis close error', { error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}

// Create singleton instance
export const redisCache = new RedisCacheService();

// Graceful shutdown
process.on('SIGINT', async () => {
  await redisCache.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await redisCache.close();
  process.exit(0);
}); 