import { FliprClient } from '@flipr/core-js-sdk-client';

const flipr = new FliprClient({
	apiKey: '<<api-key>>',
	environment: 'production',
});

async function test() {
	try {
		await flipr.initialize();
		await flipr.startPolling();

		const useTextV2 = flipr.isEnabled('text-v2');

		const resultContainer = document.getElementById('result');

		if (useTextV2) {
			resultContainer.innerText = 'Text V2 is enabled';
		} else {
			resultContainer.innerText = 'Text V2 is disabled';
		}
	} catch (err) {
		console.error(err);
	}
}

test();
