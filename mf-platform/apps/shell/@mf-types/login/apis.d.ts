
    export type RemoteKeys = 'login/App';
    type PackageType<T> = T extends 'login/App' ? typeof import('login/App') :any;