import preprocess from "svelte-preprocess";
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
		  postcss: true,
		}),
	],
	kit: {
		adapter: adapter(),
		version: {
			//name: Date.now().toString(),
			pollInterval: 60*1000
		}
	}
};

export default config;
