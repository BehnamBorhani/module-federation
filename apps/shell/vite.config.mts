import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import { mfAliases, mfShared } from '../../packages/shared/vite-aliases.mts';

const PORT = 4210;

export default defineConfig({
  server: {
    port: PORT,
    strictPort: true,
    host: '127.0.0.1',
  },
  preview: { port: PORT, strictPort: true },
  resolve: {
    alias: mfAliases(import.meta.url),
  },
  optimizeDeps: {
    include: ['es-module-shims', '@angular-architects/native-federation-v4'],
  },
  build: { target: 'chrome89' },
  plugins: [
    federation({
      name: 'shell',
      shared: {
        ...mfShared,
        'react-router-dom': { singleton: true, requiredVersion: '^7.0.0' },
      },
    }),
    react(),
  ],
});
