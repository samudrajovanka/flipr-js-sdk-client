export type FlagRule = {
	type: 'percentage';
	value: number;
};

export type Flag = {
	enabled: boolean;
	rules: FlagRule[];
};

export type FlagsRecord = Record<string, Flag>;

