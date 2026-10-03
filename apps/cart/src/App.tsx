import { useSyncExternalStore } from 'react';
import { getCartStore } from '@mf/events';
import '@mf/styles';

export function App() {
  const cart = getCartStore();
  const items = useSyncExternalStore(
    (onStoreChange) => cart.subscribe(onStoreChange),
    () => cart.getItems(),
    () => cart.getItems(),
  );

  return (
    <section className="card" data-testid="cart">
      <h2>Cart</h2>
      <p className="muted">Horizontal split: this widget is a separate remote.</p>
      {items.length === 0 ? (
        <p className="muted">Empty. Add a product from Shop.</p>
      ) : (
        items.map((item) => (
          <div className="cart-item" key={item.sku}>
            <span>{item.name}</span>
            <span>x{item.qty}</span>
          </div>
        ))
      )}
      <button className="btn secondary" type="button" onClick={() => cart.clear()}>
        Clear
      </button>
    </section>
  );
}

export default App;
