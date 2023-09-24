import { runBrowserTests } from '../CirclePacker.test.js';

const modulesToTest = [
	{ modulePath: '../../dist/circlepacker.esm.js', testType: 'dist-esm' },
	{ modulePath: '../../dist/circlepacker.esm.min.js', testType: 'dist-esm-min' },
];

async function runTestsForModule(data) {
	const item = await import(data.modulePath);

	const CirclePacker = item.CirclePacker;
	const pack = item.pack;
	runBrowserTests(CirclePacker, pack, undefined, data.testType);
}

for (let data of modulesToTest) {
	await runTestsForModule(data);
}
