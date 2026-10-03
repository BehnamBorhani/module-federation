import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuthStore } from '@mf/auth';
import type { Permission } from '@mf/contracts';
import { useSyncExternalStore } from 'react';
import { lazyProvider } from './mf';
import { ProviderBoundary } from './ProviderBoundary';

const Header = lazyProvider('header', 'App');

function useUser() {
  const store = getAuthStore();
  return useSyncExternalStore(
    (onStoreChange) => store.subscribe(onStoreChange),
    () => store.getUser(),
    () => store.getUser(),
  );
}

export function PublicOnly({ children }: { children: React.ReactNode }) {
  const user = useUser();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useUser();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

export function RequirePermission({
  permission,
  children,
}: {
  permission: Permission;
  children: React.ReactNode;
}) {
  const user = useUser();
  if (!user) return <Navigate to="/login" replace />;
  if (!user.permissions.includes(permission)) {
    return <Navigate to="/403" replace />;
  }
  return children;
}

export function AuthenticatedLayout() {
  return (
    <RequireAuth>
      <div className="shell">
        <ProviderBoundary name="header">
          <Header />
        </ProviderBoundary>
        <main className="page">
          <Outlet />
        </main>
      </div>
    </RequireAuth>
  );
}

export function ForbiddenPage() {
  return (
    <section className="card">
      <h1>403</h1>
      <p>You signed in, but this module is not in your token permissions.</p>
    </section>
  );
}
