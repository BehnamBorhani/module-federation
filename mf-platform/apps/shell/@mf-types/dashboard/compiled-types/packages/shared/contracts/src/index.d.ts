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
export declare const DEMO_USERS: DemoAccount[];
export declare const PRODUCTS: Product[];
export declare const MF_EVENTS: {
    readonly CART_ADD: "mf:cart:add";
    readonly CART_CLEAR: "mf:cart:clear";
    readonly CART_CHANGED: "mf:cart:changed";
    readonly AUTH_CHANGED: "mf:auth:changed";
};
export declare const SHELL_ORIGIN = "http://127.0.0.1:4210";
export declare const LOGIN_ORIGIN = "http://127.0.0.1:4201";
export declare const INVENTORY_ORIGIN = "http://127.0.0.1:4301";
