import { birVite } from 'birframework';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import preact from '@preact/preset-vite';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/build/' : '/',
  publicDir: false,
  plugins: [birVite(), tailwindcss(), preact()],
  build: {
    outDir: 'public/build',
    emptyOutDir: true,
    manifest: 'manifest.json',
    rollupOptions: {
      input: ['resources/css/app.css', 'resources/js/app.tsx'],
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    cors: true,
  },
}));
