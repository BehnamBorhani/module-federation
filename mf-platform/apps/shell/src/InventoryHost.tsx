import { useEffect, useState } from 'react';
import { ensureInventoryElements } from './angular-bridge';

export function InventoryHost({
  variant,
}: {
  variant: 'page' | 'widget';
}) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void ensureInventoryElements().catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="card" role="alert">
        <p className="error">{error}</p>
        <p className="muted">
          Run <code>npx nx serve inventory</code> on port 4301.
        </p>
      </div>
    );
  }

  const Tag = variant === 'page' ? 'mf-inventory' : 'mf-inventory-widget';
  return <Tag />;
}
