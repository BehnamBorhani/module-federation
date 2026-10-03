import { Component, Suspense, type ReactNode } from 'react';

export class ProviderBoundary extends Component<
  { children: ReactNode; name: string },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="card" role="alert">
          <p className="error">
            Provider &quot;{this.props.name}&quot; unavailable:{' '}
            {this.state.error.message}
          </p>
          <p className="muted">
            Start it with <code>npx nx serve {this.props.name}</code>
          </p>
        </div>
      );
    }

    return (
      <Suspense fallback={<p className="muted">Loading {this.props.name}...</p>}>
        {this.props.children}
      </Suspense>
    );
  }
}
