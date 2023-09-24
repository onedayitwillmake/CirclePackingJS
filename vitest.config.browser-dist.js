import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['tests/dist-tests/*.browser.test.{mjs,js}'],
		browser: {
			enabled: true,
			headless: true,
			name: 'chrome', // browser name is required
		},
	},
});
