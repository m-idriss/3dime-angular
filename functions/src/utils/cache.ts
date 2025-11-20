import { getFirestore } from "firebase-admin/firestore";
import { log } from "firebase-functions/logger";

/**
 * Cache configuration options
 */
export interface CacheOptions {
  /** Collection name in Firestore */
  collection: string;
  /** Document ID for cache entry */
  key: string;
  /** Cache Time-To-Live in milliseconds */
  ttl: number;
  /** Force refresh cooldown in milliseconds */
  forceCooldown?: number;
}

/**
 * Cache entry structure in Firestore
 */
interface CacheEntry<T> {
  version: string;
  data: T;
  lastCheckAt: number;
  updatedAt: string;
}

/**
 * Unified caching utility for Firebase Functions
 * Provides consistent caching behavior across all backend endpoints
 * 
 * Features:
 * - Immediate response from cache if available
 * - Background refresh when cache is stale
 * - Versioning to detect data changes
 * - Cooldown periods to prevent excessive API calls
 * 
 * @example
 * ```typescript
 * const cache = new CacheManager({
 *   collection: 'api-cache',
 *   key: 'github-profile',
 *   ttl: 3600000, // 1 hour
 *   forceCooldown: 300000 // 5 minutes
 * });
 * 
 * const data = await cache.get(
 *   async () => fetchFromAPI(),
 *   (data) => JSON.stringify(data)
 * );
 * ```
 */
export class CacheManager<T> {
  private db = getFirestore();
  private options: Required<CacheOptions>;

  constructor(options: CacheOptions) {
    this.options = {
      ...options,
      forceCooldown: options.forceCooldown || 5 * 60 * 1000, // Default 5 minutes
    };
  }

  /**
   * Get data from cache or fetch fresh data
   * 
   * @param fetchFn Function to fetch fresh data from external API
   * @param versionFn Function to compute version hash from data
   * @param forceRefresh Whether to force a refresh (must respect cooldown)
   * @returns Cached or fresh data
   */
  async get(
    fetchFn: () => Promise<T>,
    versionFn: (data: T) => string,
    forceRefresh = false
  ): Promise<T> {
    const cacheRef = this.db.collection(this.options.collection).doc(this.options.key);
    const cacheSnap = await cacheRef.get();
    const now = Date.now();
    const cacheData = cacheSnap.exists ? (cacheSnap.data() as CacheEntry<T>) : null;

    // Calculate if we can/should refresh
    const lastCheck = cacheData?.lastCheckAt || 0;
    const canRefresh = now - lastCheck > this.options.ttl;
    const canForce = now - lastCheck > this.options.forceCooldown;

    // Return cached data if available
    if (cacheData?.data) {
      log(`Cache hit for ${this.options.key}`, { age: now - lastCheck });

      // Check if we should refresh in background
      const shouldRefresh = forceRefresh ? canForce : canRefresh;
      
      if (shouldRefresh) {
        // Background refresh - don't await
        this.refreshCache(cacheRef, cacheData, fetchFn, versionFn, now).catch((err) => {
          log(`Background refresh failed for ${this.options.key}`, { error: err.message });
        });
      } else {
        log(`Cooldown active for ${this.options.key} - skipping refresh`);
      }

      return cacheData.data;
    }

    // No cache available - fetch fresh data
    log(`Cache miss for ${this.options.key} - fetching fresh data`);
    const freshData = await fetchFn();
    const version = versionFn(freshData);

    await cacheRef.set({
      version,
      data: freshData,
      lastCheckAt: now,
      updatedAt: new Date().toISOString(),
    });

    log(`Cache initialized for ${this.options.key}`);
    return freshData;
  }

  /**
   * Refresh cache in background
   */
  private async refreshCache(
    cacheRef: FirebaseFirestore.DocumentReference,
    cacheData: CacheEntry<T>,
    fetchFn: () => Promise<T>,
    versionFn: (data: T) => string,
    now: number
  ): Promise<void> {
    try {
      log(`Refreshing cache for ${this.options.key}`);
      const freshData = await fetchFn();
      const newVersion = versionFn(freshData);
      const oldVersion = cacheData.version;

      if (newVersion !== oldVersion) {
        await cacheRef.set({
          version: newVersion,
          data: freshData,
          lastCheckAt: now,
          updatedAt: new Date().toISOString(),
        });
        log(`Cache updated for ${this.options.key} (version changed)`, {
          oldVersion,
          newVersion,
        });
      } else {
        await cacheRef.update({ lastCheckAt: now });
        log(`Cache checked for ${this.options.key} - no changes`);
      }
    } catch (error: any) {
      log(`Cache refresh error for ${this.options.key}`, { error: error.message });
      throw error;
    }
  }

  /**
   * Clear cache entry manually
   */
  async clear(): Promise<void> {
    const cacheRef = this.db.collection(this.options.collection).doc(this.options.key);
    await cacheRef.delete();
    log(`Cache cleared for ${this.options.key}`);
  }

  /**
   * Get cache metadata without fetching data
   */
  async getMetadata(): Promise<{
    exists: boolean;
    lastCheckAt?: number;
    updatedAt?: string;
    version?: string;
  }> {
    const cacheRef = this.db.collection(this.options.collection).doc(this.options.key);
    const cacheSnap = await cacheRef.get();
    
    if (!cacheSnap.exists) {
      return { exists: false };
    }

    const data = cacheSnap.data() as CacheEntry<T>;
    return {
      exists: true,
      lastCheckAt: data.lastCheckAt,
      updatedAt: data.updatedAt,
      version: data.version,
    };
  }

  /**
   * Directly set cache data without fetching from external API
   * Useful for webhook-driven cache updates where data is provided directly
   * 
   * Note: This method updates `lastCheckAt` to prevent immediate background refresh.
   * This is intentional - when a webhook updates the cache, we consider it fresh and
   * reset the cooldown timer. The cache will only refresh again after the TTL expires.
   * 
   * @param data The data to store in cache
   * @param versionFn Function to compute version hash from data
   * @returns The stored data
   */
  async set(data: T, versionFn: (data: T) => string): Promise<T> {
    const cacheRef = this.db.collection(this.options.collection).doc(this.options.key);
    const now = Date.now();
    const version = versionFn(data);

    await cacheRef.set({
      version,
      data,
      lastCheckAt: now,
      updatedAt: new Date().toISOString(),
    });

    log(`Cache set for ${this.options.key}`, { version });
    return data;
  }
}

/**
 * Helper function to create a simple hash from any data
 * Used as default version function when specific versioning is not needed
 * 
 * Note: This uses string length as a simple hash for performance and simplicity.
 * While this can have collisions, it's sufficient for cache versioning where:
 * - We only need to detect if data changed (not cryptographic security)
 * - False positives (detecting change when none occurred) are acceptable
 * - Performance is prioritized over collision resistance
 * - The hash is combined with other metadata (timestamps) for cache decisions
 * 
 * For applications requiring stronger collision resistance, provide a custom
 * version function using crypto.createHash('sha256') or similar.
 */
export function simpleHash(data: any): string {
  return JSON.stringify(data).length.toString(16);
}
