import { MF_EVENTS, type CartItem } from '@mf/contracts';

const BUS_KEY = '__MF_BUS__';
const CART_KEY = '__MF_CART__';
const CART_STORAGE_KEY = 'mf.cart.items';

type BusWindow = Window & {
  [BUS_KEY]?: EventTarget;
  [CART_KEY]?: CartStore;
};

export function getBus(): EventTarget {
  const host = window as BusWindow;
  if (!host[BUS_KEY]) {
    host[BUS_KEY] = new EventTarget();
  }
  return host[BUS_KEY];
}

export function emit<T>(type: string, detail: T): void {
  getBus().dispatchEvent(new CustomEvent(type, { detail }));
}

export function on<T>(type: string, handler: (detail: T) => void): () => void {
  const bus = getBus();
  const listener = (event: Event) => handler((event as CustomEvent<T>).detail);
  bus.addEventListener(type, listener);
  return () => bus.removeEventListener(type, listener);
}

export class CartStore {
  private listeners = new Set<() => void>();
  private items: CartItem[] = [];

  constructor() {
    this.items = this.read();
  }

  getItems(): CartItem[] {
    return this.items;
  }

  count(): number {
    return this.items.reduce((sum, item) => sum + item.qty, 0);
  }

  add(item: CartItem): void {
    const next = this.items.map((entry) => ({ ...entry }));
    const existing = next.find((entry) => entry.sku === item.sku);
    if (existing) {
      existing.qty += item.qty;
    } else {
      next.push({ ...item });
    }
    this.persist(next);
    emit(MF_EVENTS.CART_ADD, item);
    emit(MF_EVENTS.CART_CHANGED, next);
  }

  clear(): void {
    this.persist([]);
    emit(MF_EVENTS.CART_CLEAR, null);
    emit(MF_EVENTS.CART_CHANGED, []);
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    const offChanged = on(MF_EVENTS.CART_CHANGED, () => listener());
    return () => {
      this.listeners.delete(listener);
      offChanged();
    };
  }

  private read(): CartItem[] {
    try {
      return JSON.parse(sessionStorage.getItem(CART_STORAGE_KEY) ?? '[]') as CartItem[];
    } catch {
      return [];
    }
  }

  private persist(items: CartItem[]): void {
    this.items = items;
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    this.listeners.forEach((listener) => listener());
  }
}

export function getCartStore(): CartStore {
  const host = window as BusWindow;
  if (!host[CART_KEY]) {
    host[CART_KEY] = new CartStore();
  }
  return host[CART_KEY];
}
