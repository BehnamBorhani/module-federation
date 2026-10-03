
    export type RemoteKeys = 'cart/App';
    type PackageType<T> = T extends 'cart/App' ? typeof import('cart/App') :any;