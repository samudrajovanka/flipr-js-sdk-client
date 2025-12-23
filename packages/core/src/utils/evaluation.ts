import type { EvaluationContext } from '../services/client/types';
import type {
	Flag,
	PercentageRule,
	TargetingCondition,
	TargetingRule,
} from '../types/flags';

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
};

/**
 * Evaluates a targeting rule for a given flag
 * @param flagKey - The flag key
 * @param rule - The targeting rule to evaluate
 * @param context - The evaluation context
 * @returns Whether the targeting rule is satisfied
 */
const evaluateTargetingRule = (
	flagKey: string,
	rule: TargetingRule,
	context: EvaluationContext,
): boolean => {
	const evaluateCondition = (condition: TargetingCondition): boolean => {
		const attributeValue = context[condition.attribute];

		if (attributeValue === undefined || attributeValue === null) {
			console.warn(
				`[Flipr] Flag '${flagKey}' has targeting rule but attribute '${condition.attribute}' missing in context for targeting rule.`,
			);

			return false;
		}

		let isMatch = false;

		switch (condition.operator) {
			case 'EQUALS':
				isMatch = String(attributeValue) === condition.value;
				break;
			case 'CONTAINS':
				isMatch = String(attributeValue).includes(condition.value);
				break;
			case 'STARTS_WITH':
				isMatch = String(attributeValue).startsWith(condition.value);
				break;
			case 'ENDS_WITH':
				isMatch = String(attributeValue).endsWith(condition.value);
				break;
			case 'IN':
				if (Array.isArray(condition.value)) {
					isMatch = condition.value.includes(String(attributeValue));
				} else {
					console.warn(
						`[Flipr] Flag '${flagKey}' has targeting rule with 'IN' operator but non-array value for attribute '${condition.attribute}'.`,
					);
				}
				break;
		}

		return condition.negate ? !isMatch : isMatch;
	};

	if (rule.logic === 'AND') {
		return rule.conditions.every(evaluateCondition);
	}

	if (rule.logic === 'OR') {
		return rule.conditions.some(evaluateCondition);
	}

	return false;
};

/**
 * Evaluates a percentage rule for a given flag
 * @param flagKey - The flag key
 * @param environment - The environment name
 * @param rule - The percentage rule to evaluate
 * @param context - The evaluation context
 * @returns Whether the percentage rule is satisfied
 */
const evaluatePercentageRule = (
	flagKey: string,
	environment: string,
	rule: PercentageRule,
	context: EvaluationContext,
): boolean => {
	if (!context.identifier) {
		console.warn(
			`[Flipr] Flag '${flagKey}' has percentage rule but no identifier provided. Defaulting to false.`,
		);

		return false;
	}

	const hash = generateHash(`${environment}:${flagKey}:${context.identifier}`);
	const bucket = hash % 100;

	return bucket < rule.value;
};

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

	if (!flag.rules.length) {
		return true;
	}

	return flag.rules.every((rule) => {
		if (rule.type === 'percentage') {
			return evaluatePercentageRule(flagKey, environment, rule, context);
		} else if (rule.type === 'targeting') {
			return evaluateTargetingRule(flagKey, rule, context);
		}

		console.warn(`[Flipr] Flag '${flagKey}' has unknown rule type`);
		return false;
	});
};
