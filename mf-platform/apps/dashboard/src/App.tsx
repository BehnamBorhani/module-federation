import { useSyncExternalStore } from 'react';
import { getAuthStore } from '@mf/auth';
import '@mf/styles';

export function App() {
  const store = getAuthStore();
  const user = useSyncExternalStore(
    (onStoreChange) => store.subscribe(onStoreChange),
    () => store.getUser(),
    () => store.getUser(),
  );

  if (!store.hasPermission('dashboard')) {
    return (
      <section className="card">
        <h1>Dashboard blocked</h1>
        <p className="error">This remote also checks the token itself.</p>
      </section>
    );
  }

  return (
    <section className="card" data-testid="dashboard">
      <h1>Dashboard</h1>
      <p className="muted">Vertical split: this whole route is a React remote.</p>
      <p>
        Signed in as <strong>{user?.name}</strong> ({user?.sub})
      </p>
      <p>
        Permissions:{' '}
        {user?.permissions.map((permission) => (
          <span className="badge" key={permission} style={{ marginRight: 8 }}>
            {permission}
          </span>
        ))}
      </p>
    </section>
  );
}

export default App;
