interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class Cache {
  private store = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    };
    this.store.set(key, entry);
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    
    if (!entry) {
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.store.delete(key);
      return null;
    }

    return entry.data as T;
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;
    
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.store.delete(key);
      return false;
    }
    
    return true;
  }

  getStats() {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys()),
    };
  }
}

// Global cache instance
export const cache = new Cache();

// Cache keys generator
export function generateCacheKey(prefix: string, params: Record<string, unknown>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|');
  
  return `${prefix}:${sortedParams}`;
}

// Cache decorator for API responses
export function withCache<T>(
  cacheKey: string,
  ttlSeconds: number = 300,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = cache.get<T>(cacheKey);
  if (cached) {
    console.log(`Cache hit for key: ${cacheKey}`);
    return Promise.resolve(cached);
  }

  console.log(`Cache miss for key: ${cacheKey}`);
  return fetcher().then(data => {
    cache.set(cacheKey, data, ttlSeconds);
    return data;
  });
} 