import { isAxiosError } from 'axios';
import { ListenerFlagKey } from '../../constants/listener';
import { getFlags as endpointGetFlags } from '../../endpoints/flags';
import { ForbiddenError } from '../../exceptions';
import type { FlagUpdateEvent } from '../../types/events';
import type { Flag, FlagsRecord } from '../../types/flags';
import { evaluateFlag } from '../../utils/evaluation';
import { Cache } from '../cache';
import { PollingConnection } from '../connection/polling';
import { StreamConnection } from '../connection/stream';
import { FliprEventEmitter } from '../event/emitter';
import type { EvaluationContext, FliprConfig, InitializeConfig } from './types';

export class FliprClient {
	private cache: Cache<Flag | FlagsRecord>;
	private cacheTTL: number;
	pollingConnection: PollingConnection;
	streamConnection: StreamConnection;
	private emitter: FliprEventEmitter;

	constructor(private config: FliprConfig) {
		this.cacheTTL = 1000 * 60 * 60; // 1 hour
		this.cache = new Cache<Flag | FlagsRecord>();
		this.emitter = new FliprEventEmitter();
		this.pollingConnection = new PollingConnection(() => {
			this.getFlags();
		});
		this.streamConnection = new StreamConnection(
			this.config,
			(data) => this.handleStreamUpdate(data),
			(error) => {
				console.error(
					'SSE connection error, falling back to polling...',
					error,
				);
				this.streamConnection.disconnect();
				this.pollingConnection.connect();
			},
		);
	}

	async initialize(config?: InitializeConfig) {
		await this.getFlags();

		if (config?.autoConnectStream) this.streamConnection.connect();
		else this.pollingConnection.connect();
	}

	private getCacheKey(key: string) {
		return `flags:${this.config.environment}:${key}`;
	}

	private async getFlags(): Promise<FlagsRecord> {
		try {
			const response = await endpointGetFlags(this.config.environment, {
				apiKey: this.config.apiKey,
			});

			const flags = response.data.data.flags || [];

			const currentKeys = new Set(this.cache.keys());

			Object.entries(flags).forEach(([key, flag]) => {
				const cacheKey = this.getCacheKey(key);
				const currentFlag = this.cache.get(cacheKey);

				if (
					!currentFlag ||
					JSON.stringify(currentFlag) !== JSON.stringify(flag)
				) {
					this.cache.set(cacheKey, flag, this.cacheTTL);
					this.emitter.emit(ListenerFlagKey.change, key);
					this.emitter.emit(key, key);
				}

				currentKeys.delete(cacheKey);
			});

			currentKeys.forEach((cacheKey) => {
				const parts = cacheKey.split(':');
				const flagKey = parts[parts.length - 1];

				this.cache.delete(cacheKey);
				this.emitter.emit(ListenerFlagKey.change, flagKey);
				this.emitter.emit(flagKey, flagKey);
			});

			return flags;
		} catch (error) {
			if (isAxiosError(error)) {
				if (error.status === 403) throw new ForbiddenError();
			}

			throw error;
		}
	}

	private handleStreamUpdate(data: FlagUpdateEvent) {
		const cacheKey = this.getCacheKey(data.flagKey);

		if (data.type === 'DELETED') {
			this.cache.delete(cacheKey);
		} else if (data.data) {
			this.cache.set(cacheKey, data.data, this.cacheTTL);
		}

		this.emitter.emit(ListenerFlagKey.change, data.flagKey);
		this.emitter.emit(data.flagKey, data.flagKey);
	}

	private getFlag(key: string) {
		const cacheKey = this.getCacheKey(key);

		return this.cache.get(cacheKey) as Flag | undefined;
	}

	private getContext(context?: Partial<EvaluationContext>) {
		return { ...this.config.context, ...(context ?? {}) };
	}

	setContext(context: EvaluationContext, options?: { replace?: boolean }) {
		this.config.context = options?.replace ? context : this.getContext(context);
	}

	clearContext() {
		this.config.context = {};
	}

	isEnabled(key: string, context?: Partial<EvaluationContext>) {
		const flag = this.getFlag(key);

		if (!flag) return false;

		const mergedContext = this.getContext(context);

		return evaluateFlag(this.config.environment, flag, key, mergedContext);
	}

	onChange(handler: (changedKey: string) => void) {
		return this.emitter.on(ListenerFlagKey.change, handler);
	}

	onFlag(key: string, handler: () => void) {
		const callback = (changedKey: string) => {
			if (changedKey === key) handler();
		};

		return this.emitter.on(key, callback);
	}
}
