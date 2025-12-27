import type { Connection } from './types';

export class PollingConnection implements Connection {
	private pollingInterval: NodeJS.Timeout | null = null;

	constructor(
		private callback: () => void,
		private intervalMs: number = 15000,
	) {}

	connect() {
		if (this.pollingInterval) return;
		this.pollingInterval = setInterval(() => this.callback(), this.intervalMs);
	}

	disconnect() {
		if (!this.pollingInterval) return;
		clearInterval(this.pollingInterval);
		this.pollingInterval = null;
	}
}
