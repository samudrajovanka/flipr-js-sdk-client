import { isAxiosError } from 'axios';
import { getFlags as endpointGetFlags } from '../../endpoints/flags';
import { ForbiddenError } from '../../exceptions';
import type { Flag, FlagsRecord } from '../../types/flags';
import { Cache } from '../cache';
import type { FliprConfig } from './types';

export class FliprClient {
	private config: Required<FliprConfig>;
	private cache: Cache<Flag | FlagsRecord>;
	private cacheTTL: number;
	private pollingInterval: NodeJS.Timeout | null = null;

	constructor(config: FliprConfig) {
		this.config = { ...config };
		this.cacheTTL = 1000 * 60 * 60; // 1 hour

		this.cache = new Cache<Flag | FlagsRecord>();
	}

	async initialize() {
		await this.getFlags();
	}

	private async getFlags(): Promise<FlagsRecord> {
		try {
			const response = await endpointGetFlags(this.config.environment, {
				apiKey: this.config.apiKey,
			});

			const flags = response.data.data.flags || [];

			this.cache.clear();

			Object.entries(flags).forEach(([key, flag]) => {
				this.cache.set(
					`flags:${this.config.environment}:${key}`,
					flag,
					this.cacheTTL,
				);
			});

			return flags;
		} catch (error) {
			if (isAxiosError(error)) {
				if (error.status === 403) throw new ForbiddenError();
			}

			throw error;
		}
	}

	private getFlag(key: string) {
		const cacheKey = `flags:${this.config.environment}:${key}`;

		return this.cache.get(cacheKey) as Flag | undefined;
	}

	isEnabled(key: string) {
		const flag = this.getFlag(key);

		if (!flag) return false;

		return flag.enabled;
	}

	startPolling(ms = 15000) {
		if (this.pollingInterval) return;
		this.pollingInterval = setInterval(() => this.getFlags(), ms);
	}

	stopPolling() {
		if (!this.pollingInterval) return;
		clearInterval(this.pollingInterval);
		this.pollingInterval = null;
	}
}
