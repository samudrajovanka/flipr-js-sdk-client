import type { Flag } from './flags';

export type FlagUpdateType = 'UPDATED' | 'DELETED' | 'CREATED';

export type FlagUpdateEvent = {
	timestamp: number;
	projectId: string;
	environment: string;
	flagKey: string;
	type: FlagUpdateType;
	data?: Flag;
};
