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
