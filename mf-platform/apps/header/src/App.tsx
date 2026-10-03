import { NavLink } from 'react-router-dom';
import { useSyncExternalStore } from 'react';
import { getAuthStore } from '@mf/auth';
import { getCartStore } from '@mf/events';
import type { Permission } from '@mf/contracts';
import '@mf/styles';

const LINKS: Array<{ to: string; label: string; permission: Permission }> = [
  { to: '/dashboard', label: 'Dashboard', permission: 'dashboard' },
  { to: '/shop', label: 'Shop', permission: 'shop' },
  { to: '/inventory', label: 'Inventory', permission: 'inventory' },
];

export function App() {
  const auth = getAuthStore();
  const cart = getCartStore();
  const user = useSyncExternalStore(
    (onStoreChange) => auth.subscribe(onStoreChange),
    () => auth.getUser(),
    () => auth.getUser(),
  );
  const count = useSyncExternalStore(
    (onStoreChange) => cart.subscribe(onStoreChange),
    () => cart.count(),
    () => cart.count(),
  );

  return (
    <header className="header" data-testid="header">
      <span className="brand">MF Portal</span>
      <nav className="nav">
        {LINKS.filter((link) => auth.hasPermission(link.permission)).map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="header-meta">
        <span>Cart {count}</span>
        <span>{user?.name}</span>
        <button
          className="btn secondary"
          type="button"
          onClick={() => {
            cart.clear();
            auth.logout();
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default App;
