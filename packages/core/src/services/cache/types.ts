/**
 * Cache entry with expiration time
 */
export interface CacheEntry<T> {
	value: T;
	expiresAt: number;
}
