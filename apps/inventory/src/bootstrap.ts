import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { InventoryWidget } from './app/inventory-widget';

createApplication(appConfig)
  .then(({ injector }) => {
    if (!customElements.get('mf-inventory')) {
      customElements.define(
        'mf-inventory',
        createCustomElement(App, { injector }),
      );
    }
    if (!customElements.get('mf-inventory-widget')) {
      customElements.define(
        'mf-inventory-widget',
        createCustomElement(InventoryWidget, { injector }),
      );
    }
  })
  .catch((err) => console.error(err));
