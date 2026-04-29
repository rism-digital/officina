import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const base = process.env.BASE_PATH || '/';

export default defineConfig({
  base,
  plugins: [svelte()],
  build: {
    sourcemap: true
  }
});
