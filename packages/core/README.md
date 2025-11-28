# @flipr/core-js-sdk-client

TypeScript/JavaScript client SDK for Flipr feature flags.

## Installation

```bash
# npm
npm install @flipr/core-js-sdk-client

# pnpm
pnpm add @flipr/core-js-sdk-client

# Yarn
yarn add @flipr/core-js-sdk-client

# Bun
bun add @flipr/core-js-sdk-client
```

## Quick Start

```typescript
import { FliprClient } from "@flipr/core-js-sdk-client";

const client = new FliprClient({
  apiKey: "<<your-api-key>>",
  environment: "<<env-stage>>",
});

// Initialize the client (fetches all flags)
await client.initialize();

// Start auto-polling for flag updates (every 15 seconds by default)
client.startPolling();

// Check if a flag is enabled
const isNewFeatureEnabled = client.isEnabled("new-feature");
if (isNewFeatureEnabled) {
  console.log("New feature is enabled!");
}

// Stop polling when done
client.stopPolling();
```

## Configuration

```typescript
interface FliprConfig {
  // Required: API key for authentication
  apiKey: string;

  // Required: Environment name (e.g., 'development', 'staging', 'production')
  environment: string;
}
```

## API Methods

### `initialize(): Promise<void>`

Initialize the SDK by fetching all feature flags for the configured environment. This populates the internal cache and should be called before using other methods.

```typescript
await client.initialize();
```

### `isEnabled(key: string): boolean`

Check if a feature flag is enabled. Returns `false` if the flag doesn't exist.

**Important:** This is a synchronous method that reads from the internal cache. Make sure to call `initialize()` first.

```typescript
if (client.isEnabled("new-feature")) {
  // Feature is enabled
}
```

### `startPolling(ms?: number): void`

Start automatic polling to refresh flags at regular intervals. Defaults to 15 seconds (15000ms) if no interval is specified.

```typescript
// Poll every 15 seconds (default)
client.startPolling();

// Poll every 30 seconds
client.startPolling(30000);

// Poll every 5 seconds
client.startPolling(5000);
```

### `stopPolling(): void`

Stop automatic polling.

```typescript
client.stopPolling();
```

## Caching

The SDK uses an internal cache with a 1-hour TTL (Time To Live) to store flag values. When you call `initialize()`, it fetches all flags from the API and stores them in cache.

- **Manual refresh:** Call `initialize()` again to manually refresh all flags
- **Automatic refresh:** Use `startPolling()` to keep flags up-to-date automatically

## Examples

Check out the [examples/web](./examples/web) directory for a complete working example using Vite.

To run the example:

```bash
cd examples/web

# Using npm
npm install
npm run dev

# Using pnpm
pnpm install
pnpm run dev

# Using yarn
yarn install
yarn dev

# Using bun
bun install
bun run dev
```

## Best Practices

1. **Initialize once:** Call `initialize()` once when your application starts
2. **Use polling for real-time updates:** Enable polling to keep flags synchronized with the server
3. **Clean up:** Call `stopPolling()` when your application shuts down or component unmounts

## License

MIT
