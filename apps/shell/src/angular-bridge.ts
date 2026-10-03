import { INVENTORY_ORIGIN } from '@mf/contracts';

let loading: Promise<void> | null = null;

function waitForImportShim(): Promise<void> {
  const host = window as Window & { importShim?: unknown };
  if (host.importShim) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      if (host.importShim) {
        window.clearInterval(timer);
        resolve();
      } else if (Date.now() - started > 5000) {
        window.clearInterval(timer);
        reject(new Error('es-module-shims did not initialize'));
      }
    }, 20);
  });
}

export function ensureInventoryElements(): Promise<void> {
  if (
    customElements.get('mf-inventory') &&
    customElements.get('mf-inventory-widget')
  ) {
    return Promise.resolve();
  }
  if (loading) return loading;

  loading = (async () => {
    await waitForImportShim();
    const { initFederation } = await import(
      '@angular-architects/native-federation-v4'
    );
    const federation = await initFederation(
      { inventory: `${INVENTORY_ORIGIN}/remoteEntry.json` },
      { shimMode: true },
    );
    await federation.loadRemoteModule('inventory', './Element');
  })();

  return loading;
}
