import { SDK_CHANNEL } from '../../constants/channels';
import type { FlagUpdateEvent } from '../../types/events';
import type { FliprConfig } from '../client/types';
import type { Connection } from './types';

export class StreamConnection implements Connection {
	private eventSource: EventSource | null = null;

	constructor(
		private config: FliprConfig,
		private callback: (event: FlagUpdateEvent) => void,
		private onError?: (error: Event) => void,
	) {}

	connect() {
		if (this.eventSource) return;

		const baseUrl = process.env.API_BASE_URL || '';
		const url = new URL(
			`/sdk/environments/${this.config.environment}/stream`,
			baseUrl,
		);

		url.searchParams.append('api-key', this.config.apiKey);

		this.eventSource = new EventSource(url.toString());

		this.eventSource.onerror = (error) => {
			if (this.onError) this.onError(error);
		};

		this.eventSource.addEventListener(
			SDK_CHANNEL.FLAG_UPDATES,
			(event: Event) => {
				const messageEvent = event as MessageEvent;
				try {
					const data = JSON.parse(messageEvent.data) as FlagUpdateEvent;
					this.callback(data);
				} catch (error) {
					console.error('Failed to parse flag update event', error);
				}
			},
		);
	}

	disconnect() {
		if (!this.eventSource) return;
		this.eventSource.close();
		this.eventSource = null;
	}
}
