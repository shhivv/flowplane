import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { appWindow } from '@tauri-apps/api/window';
import Portal from './Portal';

import { enable } from 'tauri-plugin-autostart-api';
import { cn } from './lib/utils';
import { Toaster } from './components/ui/toaster';

import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://9a684ca4a62dd4dfcf35b89a93c9d831@o4506677404762112.ingest.sentry.io/4506677407776768',
  integrations: [
    new Sentry.BrowserTracing({
    }),
    new Sentry.Replay({}),
  ],
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

enable().then().catch(console.error);

function AppRoot() {
  return (
    <div className={cn('dark min-h-screen font-sans antialiased')}>
      <App />
      <Toaster />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  appWindow.label === 'main' ? <AppRoot /> : <Portal />
);
