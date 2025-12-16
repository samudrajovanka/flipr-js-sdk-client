export interface EvaluationContext {
	/**
	 * User unique identifier
	 */
	identifier?: string;
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
