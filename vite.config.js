import * as BirFramework from 'birframework';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import preact from '@preact/preset-vite';

const supportsPortDiscovery = typeof BirFramework.birVite === 'function';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/build/' : '/',
  publicDir: false,
  plugins: [
    ...(supportsPortDiscovery ? [BirFramework.birVite()] : []),
    tailwindcss(),
    preact(),
  ],
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
    // Older framework releases require the fixed asset port.
    strictPort: !supportsPortDiscovery,
    ...(supportsPortDiscovery ? {} : { origin: 'http://localhost:5173' }),
    cors: true,
  },
}));
