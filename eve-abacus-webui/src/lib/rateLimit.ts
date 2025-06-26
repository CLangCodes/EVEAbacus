type RateLimitOptions = {
  windowMs: number; // Time window in milliseconds
  max: number;      // Max requests per window per key
};

interface RateLimitEntry {
  count: number;
  expires: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function rateLimit(key: string, options: RateLimitOptions): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.expires < now) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      expires: now + options.windowMs,
    });
    return false; // Not rate limited
  }

  if (entry.count < options.max) {
    entry.count++;
    return false; // Not rate limited
  }

  // Rate limited
  return true;
}

export function getRateLimitInfo(key: string): RateLimitEntry | undefined {
  return rateLimitStore.get(key);
} 