import type { ListenerFlagKey } from '../../constants/listener';

export interface EvaluationContext {
	/**
	 * User unique identifier
	 */
	identifier?: string;
	// biome-ignore lint/suspicious/noExplicitAny: use index
	[key: string]: any;
}

/**
 * Configuration options for the Flipr SDK client
 */
export interface FliprConfig {
	/**
	 * API key for authentication (sent via X-API-Key header)
	 */
	apiKey: string;

	/**
	 * Environment name (e.g., 'development', 'staging', 'production')
	 */
	environment: string;
	/**
	 * Context for feature flag evaluation
	 */
	context?: EvaluationContext;
}

export interface InitializeConfig {
	/**
	 * Whether to automatically connect to the stream
	 */
	autoConnectStream?: boolean;
	/**
	 * Whether to automatically start polling
	 */
	autoStartPolling?: boolean;
}

export type ListenerFlagKeyType =
	| keyof typeof ListenerFlagKey
	| (string & {});
