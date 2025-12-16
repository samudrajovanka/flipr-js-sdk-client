import { FliprClient } from '@flipr/core-js-sdk-client';

const flipr = new FliprClient({
	apiKey: '<<api-key>>',
	environment: 'production',
});

async function test() {
	try {
		await flipr.initialize();
		// await flipr.startPolling(); // Disable polling for simple test

		const users = ['user1', 'user2', 'user3', 'user4', 'user5'];
		const resultContainer = document.getElementById('result');
		resultContainer.innerHTML = ''; // Clear previous results

		// 1. Initial State
		console.log('--- Initial State ---');
		users.forEach((user) => {
			// Using local context (legacy way)
			const isEnabled = flipr.isEnabled('text-v2', { identifier: user });
			logResult(
				`User ${user}: Text V2 is ${isEnabled ? 'ENABLED' : 'DISABLED'} (Local Context)`,
			);
		});

		// 2. Simulate Login using Global Context
		console.log('--- Global Context (Login) ---');
		const loggedInUser = 'user3';
		flipr.setContext({ identifier: loggedInUser });

		const isEnabledGlobal = flipr.isEnabled('text-v2');
		logResult(
			`Current User (${loggedInUser}): Text V2 is ${isEnabledGlobal ? 'ENABLED' : 'DISABLED'} (Global Context)`,
		);
	} catch (err) {
		console.error(err);
	}
}

function logResult(text) {
	const resultContainer = document.getElementById('result');
	const p = document.createElement('p');
	p.innerText = text;
	resultContainer.appendChild(p);
	console.log(text);
}

test();
