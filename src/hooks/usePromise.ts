type CacheEntry<T> = {
  status: "pending" | "success" | "error";
  value?: T;
  error?: Error;
  promise?: Promise<T>;
  timestamp: number;
};

export function usePromise<T>(
  key: string,
  promiseFn: () => Promise<T>,
  options: {
    ttl?: number; // Time to live in milliseconds
    shouldInvalidate?: boolean; // Force invalidate cache
    initialData?: T;
  } = {},
) {
  // Create a module-level cache
  const cache = new Map<string, CacheEntry<T>>();
  const { ttl, shouldInvalidate, initialData } = options;

  // If we have initial data and no cache entry, create one
  if (initialData && !cache.has(key)) {
    cache.set(key, {
      status: "success",
      value: initialData,
      timestamp: Date.now(),
    });
  }

  // Clear cache if TTL expired
  if (ttl && cache.has(key)) {
    const entry = cache.get(key)!;
    const timeSinceCache = Date.now() - entry.timestamp;
    if (timeSinceCache > ttl) {
      cache.delete(key);
    }
  }

  // Force invalidate if requested
  if (shouldInvalidate && cache.has(key)) {
    cache.delete(key);
  }

  // If we don't have a cache entry, create one
  if (!cache.has(key)) {
    const entry: CacheEntry<T> = {
      status: "pending",
      timestamp: Date.now(),
      promise: promiseFn()
        .then((value) => {
          entry.status = "success";
          entry.value = value;
          // Add timestamp for TTL
          entry.timestamp = Date.now();
          return value;
        })
        .catch((error) => {
          entry.status = "error";
          entry.error = error;
          throw error;
        }),
    };
    cache.set(key, entry);
  }

  const entry = cache.get(key)!;

  if (entry.status === "pending") {
    throw entry.promise;
  }
  if (entry.status === "error") {
    throw entry.error;
  }
  return entry.value as T;
}
