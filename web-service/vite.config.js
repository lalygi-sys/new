import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite configuration — Disko web service.
 * - React 18 JSX transform via @vitejs/plugin-react.
 * - Source maps включены в dev, отключены в production (минимизация bundle).
 * - Env prefix `VITE_*` — остальное не экспортируется в client.
 * - Port 5173 стандарт Vite.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2020',
  },
});
