# MF Platform

Nx 23 monorepo with **React 19 Module Federation** (consumer/provider + Vite) and **Angular 21 Native Federation v4**.

| App | URL | Role |
| --- | --- | --- |
| `shell` | http://127.0.0.1:4210 | React consumer / portal |
| `login` | http://localhost:4201 | React provider, also standalone |
| `dashboard` | http://localhost:4202 | Vertical React remote |
| `header` | http://localhost:4203 | Horizontal React remote |
| `shop` | http://localhost:4204 | Vertical React remote |
| `cart` | http://localhost:4205 | Horizontal React remote |
| `ng-shell` | http://localhost:4300 | Angular Native Federation host |
| `inventory` | http://localhost:4301 | Angular remote + custom elements |

## Run

```bash
cd mf-platform
npm install
npx nx serve shell
# in other terminals, or:
npm run serve:all
```

Open [http://127.0.0.1:4210](http://127.0.0.1:4210). Providers must be running or the shell shows an error boundary for that remote.

The React shell listens on **4210** (Vite binds `127.0.0.1`) so it does not collide with a typical Angular app on 4200.

## Demo users

| User | Password | Permissions |
| --- | --- | --- |
| `admin` | `admin` | dashboard, shop, inventory |
| `shopper` | `shopper` | shop |
| `viewer` | `viewer` | dashboard |

## What this base demonstrates

- **Vertical split:** `/dashboard`, `/shop`, `/inventory` are whole remotes.
- **Horizontal split:** authenticated layout loads `header`; `/shop` also loads `cart` and the Angular `<mf-inventory-widget>`.
- **Cross-app data:** Shop emits `mf:cart:add`. React cart, React header, and the Angular inventory widget all read the same window singleton bus.
- **Auth:** Login is its own app. The mock JWT is stored in `sessionStorage` of the shell window. Every remote re-reads `getAuthStore()`. Nav items and route guards hide modules that are not in the token.
- **Standalone login:** open http://localhost:4201, sign in, get redirected to the shell with `#access_token=...`.

This uses a **mock JWT** (unsigned). Production should use an httpOnly cookie on a shared domain or a BFF; the permission checks stay the same.

## Versions

- Nx 23.2
- React 19
- Angular 21.2
- TypeScript 5.9 (required by `@angular/build` 21)
- `@angular-architects/native-federation-v4` 21.2
