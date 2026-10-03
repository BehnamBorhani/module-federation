import { type CartItem } from '@mf/contracts';
export declare function getBus(): EventTarget;
export declare function emit<T>(type: string, detail: T): void;
export declare function on<T>(type: string, handler: (detail: T) => void): () => void;
export declare class CartStore {
    private listeners;
    private items;
    constructor();
    getItems(): CartItem[];
    count(): number;
    add(item: CartItem): void;
    clear(): void;
    subscribe(listener: () => void): () => void;
    private read;
    private persist;
}
export declare function getCartStore(): CartStore;
