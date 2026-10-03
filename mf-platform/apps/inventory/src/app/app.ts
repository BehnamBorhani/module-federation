import {
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { PRODUCTS, type AuthUser } from '@mf/contracts';
import { getAuthStore } from '@mf/auth';

@Component({
  selector: 'mf-inventory',
  standalone: true,
  template: `
    <section class="card" data-testid="inventory">
      <h1>Inventory</h1>
      <p class="muted">
        Angular 21 Native Federation remote. This page is also registered as
        <code>&lt;mf-inventory&gt;</code> for the React shell.
      </p>
      @if (!user()) {
        <p class="error">No shared token in this window. Login via the React portal first.</p>
      } @else if (!canSee()) {
        <p class="error">Token found, but inventory permission is missing.</p>
      } @else {
        <p>Signed in as <strong>{{ user()?.name }}</strong></p>
        <div class="grid">
          @for (product of products; track product.sku) {
            <article class="card product">
              <strong>{{ product.name }}</strong>
              <span class="muted">{{ product.sku }}</span>
              <span [class.warn]="product.stock <= 3" [class.ok]="product.stock > 3">
                Stock {{ product.stock }}
              </span>
            </article>
          }
        </div>
      }
    </section>
  `,
})
export class App implements OnInit, OnDestroy {
  protected readonly products = PRODUCTS;
  protected readonly user = signal<AuthUser | null>(null);
  private unsubscribe?: () => void;

  ngOnInit(): void {
    const auth = getAuthStore();
    this.user.set(auth.getUser());
    this.unsubscribe = auth.subscribe(() => this.user.set(auth.getUser()));
  }

  ngOnDestroy(): void {
    this.unsubscribe?.();
  }

  protected canSee(): boolean {
    return getAuthStore().hasPermission('inventory');
  }
}

export default App;
