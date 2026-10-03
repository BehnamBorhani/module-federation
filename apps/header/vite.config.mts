import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import { mfAliases, mfShared } from '../../packages/shared/vite-aliases.mts';

const PORT = 4203;

export default defineConfig({
  server: {
    port: PORT,
    strictPort: true,
    origin: `http://localhost:${PORT}`,
    host: '127.0.0.1',
    cors: true,
  },
  preview: { port: PORT, strictPort: true, cors: true },
  resolve: { alias: mfAliases(import.meta.url) },
  build: { target: 'chrome89' },
  plugins: [
    federation({
      name: 'header',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App.tsx' },
      shared: {
        ...mfShared,
        'react-router-dom': { singleton: true, requiredVersion: '^7.0.0' },
      },
    }),
    react(),
  ],
});
