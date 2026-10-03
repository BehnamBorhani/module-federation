import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import '@mf/styles';
import { lazyProvider } from './mf';
import { ProviderBoundary } from './ProviderBoundary';
import { InventoryHost } from './InventoryHost';
import {
  AuthenticatedLayout,
  ForbiddenPage,
  PublicOnly,
  RequirePermission,
} from './guards';

const Login = lazyProvider('login', 'App');
const Dashboard = lazyProvider('dashboard', 'App');
const Shop = lazyProvider('shop', 'App');
const Cart = lazyProvider('cart', 'App');

function ShopPage() {
  return (
    <div className="split">
      <ProviderBoundary name="shop">
        <Shop />
      </ProviderBoundary>
      <aside className="page" style={{ padding: 0 }}>
        <ProviderBoundary name="cart">
          <Cart />
        </ProviderBoundary>
        <InventoryHost variant="widget" />
      </aside>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnly>
              <ProviderBoundary name="login">
                <Login />
              </ProviderBoundary>
            </PublicOnly>
          }
        />
        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <RequirePermission permission="dashboard">
                <ProviderBoundary name="dashboard">
                  <Dashboard />
                </ProviderBoundary>
              </RequirePermission>
            }
          />
          <Route
            path="/shop"
            element={
              <RequirePermission permission="shop">
                <ShopPage />
              </RequirePermission>
            }
          />
          <Route
            path="/inventory"
            element={
              <RequirePermission permission="inventory">
                <InventoryHost variant="page" />
              </RequirePermission>
            }
          />
          <Route path="/403" element={<ForbiddenPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
