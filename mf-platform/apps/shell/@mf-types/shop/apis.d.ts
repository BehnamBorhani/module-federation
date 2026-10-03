
    export type RemoteKeys = 'shop/App';
    type PackageType<T> = T extends 'shop/App' ? typeof import('shop/App') :any;