import { FliprClient } from '@flipr/core-js-sdk-client';

const flipr = new FliprClient({
	apiKey: '<<api-key>>',
	environment: 'production',
});

async function test() {
	try {
		await flipr.initialize();
		// await flipr.startPolling(); // Disable polling for simple test

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
			country: 'id',
		};
		flipr.setContext(globalUser);

		const isEnabledGlobal = flipr.isEnabled('text-v2');
		logResult(
			`Global User (${globalUser.email}): Text V2 is ${isEnabledGlobal ? 'ENABLED' : 'DISABLED'} (Global Context)`,
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
