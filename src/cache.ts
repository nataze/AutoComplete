/**
 * cache.ts
 *
 * Simplified in-memory cache with TTL and LRU eviction.
 */

interface CacheEntry<T> {
  timestamp: number;
  value: T;
}

interface CacheConfig {
  ttlMs: number;       // entry time-to-live (ms)
  maxEntries: number;  // max number of entries (LRU)
}

const DEFAULT_CONFIG: CacheConfig = {
  ttlMs: 5 * 60 * 1000,    // 5 minutes
  maxEntries: 50,
};

const cache = new Map<string, CacheEntry<any>>();

/**
 * Retrieve a cached value if fresh; renews timestamp on hit.
 */
export function getCached<T>(key: string, config: CacheConfig = DEFAULT_CONFIG): T | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.timestamp > config.ttlMs) {
    cache.delete(key);
    return undefined;
  }
  // bump recency
  entry.timestamp = Date.now();
  return entry.value as T;
}

/**
 * Store a value and evict oldest entries if over capacity.
 */
export function setCached<T>(key: string, value: T, config: CacheConfig = DEFAULT_CONFIG): void {
  cache.set(key, { timestamp: Date.now(), value });
  removeOldest(config);
}

/**
 * Evict least-recently used entries until size ≤ maxEntries.
 */
function removeOldest(config: CacheConfig) {
  while (cache.size > config.maxEntries) {
    const iter = cache.keys().next();
    if (iter.done) break;
    cache.delete(iter.value);
  }
}
