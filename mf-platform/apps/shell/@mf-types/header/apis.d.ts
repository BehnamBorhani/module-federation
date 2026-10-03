
    export type RemoteKeys = 'header/App';
    type PackageType<T> = T extends 'header/App' ? typeof import('header/App') :any;