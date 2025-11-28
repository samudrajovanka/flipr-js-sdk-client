import type { AxiosResponse } from 'axios';
import { httpClient } from '../config/httpClient';
import type { FlagsRecord } from '../types/flags';
import type { SuccessResponseData } from '../types/response';

export const getFlags = async (
	environment: string,
	option: { apiKey: string },
) => {
	return (await httpClient.get(`/sdk/environments/${environment}/flags`, {
		headers: {
			'X-API-Key': option.apiKey,
			'Content-Type': 'application/json',
		},
	})) as AxiosResponse<SuccessResponseData<{ flags: FlagsRecord }>>;
};
