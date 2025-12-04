import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), devtoolsJson()],
	server: {
		allowedHosts: ['tunnel.lysmux.dev', 'web4.lysmux.dev'],
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''), // It removes the /api from the request address, so it will truly be used only for differentiation
			},
		},
	}
});
