import { loadRemoteModule } from '@angular-architects/native-federation-v4';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      loadRemoteModule('inventory', './Component').then((m) => m.App),
  },
];
