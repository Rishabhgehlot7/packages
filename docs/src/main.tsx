import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastProvider, BoostProvider } from '@boostengine/ui';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BoostProvider defaultMode="dark" storageKey="boost_docs_theme" defaultStylePreset="minimal" syncDocumentPreset>
      <ToastProvider position="bottom-right">
        <App />
      </ToastProvider>
    </BoostProvider>
  </React.StrictMode>
);
