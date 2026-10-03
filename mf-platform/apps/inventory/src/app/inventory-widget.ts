import {
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { MF_EVENTS, PRODUCTS, type CartItem } from '@mf/contracts';
import { on } from '@mf/events';

@Component({
  selector: 'mf-inventory-widget',
  standalone: true,
  template: `
    <section class="card" data-testid="inventory-widget">
      <h2>Inventory watch</h2>
      <p class="muted">
        Horizontal Angular widget inside the React shop. Listens to
        <code>mf:cart:add</code>.
      </p>
      @if (warnings().length === 0) {
        <p class="ok">Stock looks fine. Add a low-stock item to see a warning.</p>
      }
      @for (warning of warnings(); track warning) {
        <p class="warn">{{ warning }}</p>
      }
    </section>
  `,
})
export class InventoryWidget implements OnInit, OnDestroy {
  protected readonly warnings = signal<string[]>([]);
  private off?: () => void;

  ngOnInit(): void {
    this.off = on<CartItem>(MF_EVENTS.CART_ADD, (item) => {
      const product = PRODUCTS.find((entry) => entry.sku === item.sku);
      if (product && product.stock <= 3) {
        this.warnings.update((current) => [
          `Low stock after adding ${product.name}: ${product.stock} left`,
          ...current,
        ]);
      }
    });
  }

  ngOnDestroy(): void {
    this.off?.();
  }
}
