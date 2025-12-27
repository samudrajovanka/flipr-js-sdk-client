export interface Connection {
	connect(ms?: number): void;
	disconnect(): void;
}
