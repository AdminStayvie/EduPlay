import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Critical: Ensures assets load correctly on GitHub Pages (e.g., /repo-name/)
  build: {
    outDir: 'dist',
  },
});