import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		browser: {
			enabled: true,
			headless: true,
			name: 'chrome', // browser name is required
		},
	},
});
