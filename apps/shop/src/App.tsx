import { PRODUCTS } from '@mf/contracts';
import { getAuthStore } from '@mf/auth';
import { getCartStore } from '@mf/events';
import '@mf/styles';

export function App() {
  const auth = getAuthStore();
  const cart = getCartStore();

  if (!auth.hasPermission('shop')) {
    return (
      <section className="card">
        <h1>Shop blocked</h1>
        <p className="error">Missing shop permission on the shared token.</p>
      </section>
    );
  }

  return (
    <section className="card" data-testid="shop">
      <h1>Shop</h1>
      <p className="muted">
        Vertical split for the page. Adding an item publishes <code>mf:cart:add</code> so
        the React cart and Angular inventory widget can both react.
      </p>
      <div className="grid">
        {PRODUCTS.map((product) => (
          <article className="product card" key={product.sku}>
            <strong>{product.name}</strong>
            <span className="muted">{product.sku}</span>
            <span>${product.price}</span>
            <span className={product.stock <= 3 ? 'warn' : 'ok'}>
              Stock {product.stock}
            </span>
            <button
              className="btn"
              type="button"
              onClick={() =>
                cart.add({ sku: product.sku, name: product.name, qty: 1 })
              }
            >
              Add to cart
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default App;
