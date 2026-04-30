import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const base = process.env.BASE_PATH || '/';

export default defineConfig({
  base,
  plugins: [
    svelte({
      onwarn(warning, handler) {
        if (
          warning.code === 'a11y_click_events_have_key_events' ||
          warning.code === 'a11y_no_static_element_interactions'
        ) {
          return;
        }
        handler(warning);
      }
    })
  ],
  build: {
    sourcemap: true
  }
});
