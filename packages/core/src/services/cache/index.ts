import type { CacheEntry } from './types';

export class Cache<T> {
	private store: Map<string, CacheEntry<T>>;

	constructor() {
		this.store = new Map();
	}

	/**
	 * Get a value from cache
	 * @param key Cache key
	 * @returns Cached value or undefined if not found or expired
	 */
	get(key: string): T | undefined {
		const entry = this.store.get(key);

		if (!entry) {
			return undefined;
		}

		if (Date.now() > entry.expiresAt) {
			this.store.delete(key);
			return undefined;
		}

		return entry.value;
	}

	/**
	 * Set a value in cache with TTL
	 * @param key Cache key
	 * @param value Value to cache
	 * @param ttl Time to live in milliseconds
	 */
	set(key: string, value: T, ttl: number): void {
		const expiresAt = Date.now() + ttl;
		this.store.set(key, { value, expiresAt });
	}

	/**
	 * Check if a key exists in cache and is not expired
	 * @param key Cache key
	 */
	has(key: string): boolean {
		return this.get(key) !== undefined;
	}

	/**
	 * Clear all cache entries
	 */
	clear(): void {
		this.store.clear();
	}

	/**
	 * Clear a specific cache entry
	 * @param key Cache key
	 */
	delete(key: string): void {
		this.store.delete(key);
	}
}
