import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['tests/dist-tests/*.node.test.{mjs,js}'],
	},
});
