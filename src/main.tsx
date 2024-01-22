import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { appWindow } from '@tauri-apps/api/window';
import Portal from './Portal';

import { enable } from 'tauri-plugin-autostart-api';
import { cn } from './lib/utils';
import { Toaster } from './components/ui/toaster';

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
