import type { ListenerFlagKeyType } from '../client/types';

export class FliprEventEmitter {
	private listeners: Map<string, Set<(changedKey: string) => void>> = new Map();

	on(key: ListenerFlagKeyType, callback: (changedKey: string) => void) {
		if (!this.listeners.has(key)) {
			this.listeners.set(key, new Set());
		}
		this.listeners.get(key)?.add(callback);

		return () => {
			this.off(key, callback);
		};
	}

	off(key: ListenerFlagKeyType, callback: (changedKey: string) => void) {
		const set = this.listeners.get(key);

		if (!set) return;

		set.delete(callback);
		if (set.size === 0) {
			this.listeners.delete(key);
		}
	}

	emit(key: ListenerFlagKeyType, changedKey: string) {
		this.listeners.get(key)?.forEach((cb) => {
			cb(changedKey);
		});
	}
}
