import { FormEvent, useState } from 'react';
import { authenticate, getAuthStore } from '@mf/auth';
import { DEMO_USERS, SHELL_ORIGIN } from '@mf/contracts';
import '@mf/styles';

export function App() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const embedded =
    Boolean(window.__MF_SHELL__) ||
    document.documentElement.dataset.mfShell === 'true';

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const token = authenticate(username, password);
    if (!token) {
      setError('Invalid username or password');
      return;
    }
    if (embedded) {
      getAuthStore().login(token);
      return;
    }
    window.location.href = `${SHELL_ORIGIN}/#access_token=${encodeURIComponent(token)}`;
  }

  return (
    <section className="page" data-testid="login">
      <div className="card" style={{ maxWidth: 420, margin: '10vh auto' }}>
        <h1>Sign in</h1>
        <p className="muted">
          Separate login remote. Token is stored in the shell window and read by
          every module.
        </p>
        <form onSubmit={onSubmit}>
          <label className="field">
            Username
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="field">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button className="btn" type="submit">
            Login
          </button>
        </form>
        <div className="muted" style={{ marginTop: 16 }}>
          {DEMO_USERS.map((user) => (
            <p key={user.username}>
              <code>
                {user.username} / {user.password}
              </code>{' '}
              → {user.permissions.join(', ')}
            </p>
          ))}
          {!embedded ? (
            <p>Standalone mode: after login you will be redirected to the shell.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default App;
