export type Permission = 'dashboard' | 'shop' | 'inventory';

export interface AuthUser {
  sub: string;
  name: string;
  permissions: Permission[];
  exp: number;
}

export interface DemoAccount {
  username: string;
  password: string;
  name: string;
  permissions: Permission[];
}

export interface CartItem {
  sku: string;
  name: string;
  qty: number;
}

export interface Product {
  sku: string;
  name: string;
  price: number;
  stock: number;
}

export const DEMO_USERS: DemoAccount[] = [
  {
    username: 'admin',
    password: 'admin',
    name: 'Admin',
    permissions: ['dashboard', 'shop', 'inventory'],
  },
  {
    username: 'shopper',
    password: 'shopper',
    name: 'Shopper',
    permissions: ['shop'],
  },
  {
    username: 'viewer',
    password: 'viewer',
    name: 'Viewer',
    permissions: ['dashboard'],
  },
];

export const PRODUCTS: Product[] = [
  { sku: 'NF-HOODIE', name: 'Native Federation Hoodie', price: 89, stock: 12 },
  { sku: 'NX-MUG', name: 'Nx Mug', price: 18, stock: 3 },
  { sku: 'ANG-TEE', name: 'Angular 21 Tee', price: 32, stock: 1 },
];

export const MF_EVENTS = {
  CART_ADD: 'mf:cart:add',
  CART_CLEAR: 'mf:cart:clear',
  CART_CHANGED: 'mf:cart:changed',
  AUTH_CHANGED: 'mf:auth:changed',
} as const;

export const SHELL_ORIGIN = 'http://127.0.0.1:4210';
export const LOGIN_ORIGIN = 'http://127.0.0.1:4201';
export const INVENTORY_ORIGIN = 'http://127.0.0.1:4301';
