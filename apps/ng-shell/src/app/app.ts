import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { authenticate, getAuthStore } from '@mf/auth';
import { DEMO_USERS, type AuthUser } from '@mf/contracts';

@Component({
  imports: [RouterModule, FormsModule],
  selector: 'ng-root',
  template: `
    <div class="shell">
      <header class="header">
        <span class="brand">Angular NF Host</span>
        <span class="muted">Native Federation dynamic-host on :4300</span>
        @if (user(); as current) {
          <div class="header-meta">
            <span>{{ current.name }}</span>
            <button class="btn secondary" type="button" (click)="logout()">Logout</button>
          </div>
        }
      </header>
      <main class="page">
        @if (!user()) {
          <section class="card" style="max-width: 420px">
            <h1>Angular host login</h1>
            <p class="muted">
              Same auth library as the React portal. This origin has its own
              sessionStorage, so login here is independent of the React shell on :4210.
            </p>
            <label class="field">
              Username
              <input name="username" [(ngModel)]="username" />
            </label>
            <label class="field">
              Password
              <input name="password" type="password" [(ngModel)]="password" />
            </label>
            @if (error) {
              <p class="error">{{ error }}</p>
            }
            <button class="btn" type="button" (click)="login()">Login</button>
            <div class="muted" style="margin-top: 12px">
              @for (account of accounts; track account.username) {
                <p>
                  <code>{{ account.username }} / {{ account.password }}</code>
                </p>
              }
            </div>
          </section>
        } @else {
          <router-outlet />
        }
      </main>
    </div>
  `,
})
export class App implements OnInit, OnDestroy {
  protected readonly accounts = DEMO_USERS;
  protected readonly user = signal<AuthUser | null>(null);
  protected username = 'admin';
  protected password = 'admin';
  protected error = '';
  private unsubscribe?: () => void;

  ngOnInit(): void {
    const auth = getAuthStore();
    this.user.set(auth.getUser());
    this.unsubscribe = auth.subscribe(() => this.user.set(auth.getUser()));
  }

  ngOnDestroy(): void {
    this.unsubscribe?.();
  }

  protected login(): void {
    const token = authenticate(this.username, this.password);
    if (!token) {
      this.error = 'Invalid username or password';
      return;
    }
    getAuthStore().login(token);
    this.error = '';
  }

  protected logout(): void {
    getAuthStore().logout();
  }
}
