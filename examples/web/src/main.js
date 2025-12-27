import { FliprClient } from '@flipr/core-js-sdk-client';

const flipr = new FliprClient({
	apiKey: '<<api-key>>',
	environment: 'production',
});

async function test() {
	try {
		await flipr.initialize({ autoConnectStream: true });

		// Define users with different attributes for targeting rules
		const users = [
			{
				identifier: 'user1',
				email: 'test@gmail.com',
				name: 'name',
				country: 'indonesia',
			},
			{
				identifier: 'user2',
				email: 'test@yahoo.com',
				name: 'name',
				country: 'indonesia',
			},
			{
				identifier: 'user3',
				email: 'test@gmail.com',
				name: 'name',
				country: 'singapore',
			},
			{
				identifier: 'user4',
				email: 'other@gmail.com',
				name: 'name',
				country: 'indonesia',
			},
		];

		const resultContainer = document.getElementById('result');
		resultContainer.innerHTML = ''; // Clear previous results

		// 1. Check Rules
		console.log('--- Checking Targeting Rules ---');
		users.forEach((userCtx) => {
			const isEnabled = flipr.isEnabled('text-v2', userCtx);
			logResult(
				`User ${userCtx.identifier} (${userCtx.email}, ${userCtx.country}): Text V2 is ${isEnabled ? 'ENABLED' : 'DISABLED'}`,
			);
		});

		// 2. Global Context
		console.log('--- Global Context ---');
		const globalUser = {
			identifier: 'globalUser',
			email: 'global@gmail.com',
			name: 'name',
			country: 'indonesia',
		};
		flipr.setContext(globalUser);

		const isEnabledGlobal = flipr.isEnabled('text-v2');
		logResult(
			`Global User (${globalUser.email}): Text V2 is ${isEnabledGlobal ? 'ENABLED' : 'DISABLED'} (Global Context)`,
		);

		// 3. Realtime Updates
		console.log('--- Realtime Updates (SSE) ---');
		logResult('Listening for real-time updates...');

		flipr.onFlag('text-v2', () => {
			const currentValue = flipr.isEnabled('text-v2');
			logResult(
				`[UPDATE] Text V2 changed to ${currentValue ? 'ENABLED' : 'DISABLED'} (Global Context)`,
			);
		});

		flipr.onChange((changedKey) => {
			if (changedKey === 'text-v3') {
				const currentValue = flipr.isEnabled('text-v3');
				logResult(
					`[UPDATE] Text V3 changed to ${currentValue ? 'ENABLED' : 'DISABLED'} (Global Context)`,
				);
			}
		});
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
