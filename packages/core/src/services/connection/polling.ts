import type { Connection } from './types';

export class PollingConnection implements Connection {
	private pollingInterval: NodeJS.Timeout | null = null;

	constructor(private callback: () => void) {}

	connect(ms = 15000) {
		if (this.pollingInterval) return;
		this.pollingInterval = setInterval(() => this.callback(), ms);
	}

	disconnect() {
		if (!this.pollingInterval) return;
		clearInterval(this.pollingInterval);
		this.pollingInterval = null;
	}
}
