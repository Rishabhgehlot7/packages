import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@boostengine/ui': path.resolve(__dirname, '../boost-ui/src/index.ts'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
