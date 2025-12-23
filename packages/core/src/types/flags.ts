export type PercentageRule = {
	type: 'percentage';
	value: number;
};

export type SingleValueOperator =
	| 'EQUALS'
	| 'CONTAINS'
	| 'STARTS_WITH'
	| 'ENDS_WITH';

export type ArrayValueOperator = 'IN';

export type TargetingOperator = SingleValueOperator | ArrayValueOperator;

export type BaseValueCondition = {
	attribute: string;
	negate?: boolean;
};

export type SingleValueCondition = BaseValueCondition & {
	operator: SingleValueOperator;
	value: string;
};

export type ArrayValueCondition = BaseValueCondition & {
	operator: ArrayValueOperator;
	value: string[];
};

export type TargetingCondition = SingleValueCondition | ArrayValueCondition;

export type TargetingRule = {
	type: 'targeting';
	logic: 'AND' | 'OR';
	conditions: TargetingCondition[];
};

export type FlagRule = PercentageRule | TargetingRule;

export type Flag = {
	enabled: boolean;
	rules: FlagRule[];
};

export type FlagsRecord = Record<string, Flag>;
