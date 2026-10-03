import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { getAuthStore } from '@mf/auth';
import { App } from './App';

declare global {
  interface Window {
    __MF_SHELL__?: boolean;
  }
}

window.__MF_SHELL__ = true;
getAuthStore().captureHashToken();

const container = document.getElementById('root');
if (!container) throw new Error('#root element not found');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
