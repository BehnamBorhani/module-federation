/// <reference types="vite/client" />

declare module '@mf/styles';

declare global {
  interface Window {
    __MF_SHELL__?: boolean;
  }
}

export {};
