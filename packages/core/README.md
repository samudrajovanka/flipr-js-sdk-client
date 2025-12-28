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

// Initialize the client and connect to the stream
await client.initialize({ autoConnectStream: true });

// Set global context
client.setContext({
  userId: "123",
  userRole: "admin",
});

// Check if a flag is enabled
const isNewFeatureEnabled = client.isEnabled("new-feature");
if (isNewFeatureEnabled) {
  console.log("New feature is enabled!");
}

// Watch for changes in the flag
client.onChange((changedKey) => {
  console.log("Flag changed:", changedKey);
});

// Watch for changes specific flag
client.onFlag("new-feature", () => {
  console.log("New feature flag changed!");
});
```

## Configuration

```typescript
interface FliprConfig {
  // Required: API key for authentication
  apiKey: string;

  // Required: Environment name (e.g., 'development', 'staging', 'production')
  environment: string;

  // Optional: Global context
  context?: EvaluationContext;
}
```

## API Methods

### `initialize(config?: InitializeConfig): Promise<void>`

Initialize the SDK by fetching all feature flags for the configured environment. This populates the internal cache and should be called before using other methods.

```typescript
await client.initialize();
```

### `isEnabled(key: string, context?: EvaluationContext): boolean`

Check if a feature flag is enabled. Returns `false` if the flag doesn't exist.

**Important:** This is a synchronous method that reads from the internal cache. Make sure to call `initialize()` first.

```typescript
if (client.isEnabled("new-feature")) {
  // Feature is enabled
}
```

### `setContext(context: EvaluationContext): void`

Set global context for the SDK. This is used to evaluate feature flags based on user attributes.

```typescript
client.setContext({
  userId: "123",
  userRole: "admin",
});
```

### `onChange(callback: (changedKey: string) => void): void`

Register a callback to be called when any feature flag changes.

```typescript
client.onChange((changedKey) => {
  console.log("Flag changed:", changedKey);
});
```

### `onFlag(key: string, callback: () => void): void`

Register a callback to be called when a specific feature flag changes.

```typescript
client.onFlag("new-feature", () => {
  console.log("New feature flag changed!");
});
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

1. Initialize the SDK once when your application starts
2. Set global context for the SDK. This is used to evaluate feature flags based on user attributes.

## License

MIT
