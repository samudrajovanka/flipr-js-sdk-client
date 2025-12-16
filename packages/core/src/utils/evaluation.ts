import { EvaluationContext } from "../services/client/types";
import type { Flag } from '../types/flags';

/**
 * Generates a hash for a given string using FNV-1a algorithm
 * @param str - The string to generate a hash for
 * @returns The hash value
 */
const generateHash = (str: string): number => {
	let hash = 2166136261;
	for (let i = 0; i < str.length; i++) {
		hash ^= str.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}
	return hash >>> 0;
}

/**
 * Evaluates a feature flag based on the given environment, flag, and context
 * @param environment - The environment name
 * @param flag - The flag to evaluate
 * @param flagKey - The flag key
 * @param context - The evaluation context
 * @returns Whether the flag is enabled
 */
export const evaluateFlag = (
	environment: string,
	flag: Flag,
	flagKey: string,
	context: EvaluationContext = {},
): boolean => {
	if (!flag.enabled) {
		return false;
	}

	if (!flag.rules || flag.rules.length === 0) {
		return true;
	}

	for (const rule of flag.rules) {
		if (rule.type === 'percentage') {
			if (!context.identifier) {
				console.warn(
					`[Flipr] Flag '${flagKey}' has percentage rule but no identifier provided. Defaulting to false.`,
				);
				return false;
			}

			const hash = generateHash(`${environment}:${flagKey}:${context.identifier}`);
			const bucket = hash % 100;

			return bucket < rule.value;
		}
	}

	return true;
}
