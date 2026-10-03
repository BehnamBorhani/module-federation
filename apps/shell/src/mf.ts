import { lazy, type ComponentType } from 'react';
import { registerRemotes, loadRemote } from '@module-federation/runtime';

const PROVIDERS: Array<{ alias: string; name: string; entry: string }> = [
  {
    alias: 'login',
    name: 'login',
    entry: 'http://localhost:4201/remoteEntry.js',
  },
  {
    alias: 'dashboard',
    name: 'dashboard',
    entry: 'http://localhost:4202/remoteEntry.js',
  },
  {
    alias: 'header',
    name: 'header',
    entry: 'http://localhost:4203/remoteEntry.js',
  },
  {
    alias: 'shop',
    name: 'shop',
    entry: 'http://localhost:4204/remoteEntry.js',
  },
  {
    alias: 'cart',
    name: 'cart',
    entry: 'http://localhost:4205/remoteEntry.js',
  },
];

registerRemotes(PROVIDERS.map((remote) => ({ ...remote, type: 'module' })));

export function lazyProvider<Props = unknown>(
  alias: string,
  exposeName: string,
) {
  return lazy(async () => {
    const mod = await loadRemote<{ default: ComponentType<Props> }>(
      `${alias}/${exposeName}`,
    );
    return { default: mod!.default };
  });
}
