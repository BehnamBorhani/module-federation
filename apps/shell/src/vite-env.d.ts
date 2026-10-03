/// <reference types="vite/client" />

declare module '@mf/styles';

declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      'mf-inventory': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      'mf-inventory-widget': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
