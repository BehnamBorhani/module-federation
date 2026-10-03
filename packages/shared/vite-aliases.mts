import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function workspaceRootFromApp(importMetaUrl: string): string {
  return path.resolve(path.dirname(fileURLToPath(importMetaUrl)), '../..');
}

export function mfAliases(importMetaUrl: string): Record<string, string> {
  const root = workspaceRootFromApp(importMetaUrl);
  return {
    '@mf/contracts': path.join(root, 'packages/shared/contracts/src/index.ts'),
    '@mf/auth': path.join(root, 'packages/shared/auth/src/index.ts'),
    '@mf/events': path.join(root, 'packages/shared/events/src/index.ts'),
    '@mf/styles': path.join(root, 'packages/shared/styles/mf.css'),
  };
}

export const mfShared = {
  react: { singleton: true, requiredVersion: '^19.0.0' },
  'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
};
