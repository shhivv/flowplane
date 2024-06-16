import { appWindow } from '@tauri-apps/api/window';
import ReactDOM from 'react-dom/client';
import App from './App';
import Portal from './Portal';
import './styles.css';

import { enable as enableAutoStart } from 'tauri-plugin-autostart-api';
import { Toaster } from './components/ui/toaster';
import { cn } from './lib/utils';

import * as Sentry from '@sentry/react';
import { SENTRY_URL } from './constants';
import { ThemeProvider } from '@/components/theme-provider';
import { readText } from '@tauri-apps/api/clipboard';
import { invoke } from '@tauri-apps/api';
import { useEffect, useRef } from 'react';

if (location.href !== 'http://localhost:1420/') {
  Sentry.init({
    dsn: SENTRY_URL,
    integrations: [new Sentry.BrowserTracing({}), new Sentry.Replay({})],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

// required to launch application on startup
enableAutoStart().then().catch(console.error);

// revamp later because wtf

export default function AppRoot() {
  const intervalRef = useRef(null);
  useEffect(() => {
    const checkClipboard = async () => {
      let initial = await readText();

      // @ts-expect-error don't care
      intervalRef.current = setInterval(async () => {
        const clipboardText = await readText();
        if (clipboardText !== initial) {
          initial = clipboardText;
          await invoke('push_to_clipboard', {
            newData: clipboardText,
          });
        }
      }, 1000);
    };

    checkClipboard();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className={cn('min-h-screen font-sans antialiased')}>
        <App />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

document.addEventListener('contextmenu', (event) => event.preventDefault());
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  appWindow.label === 'main' ? <AppRoot /> : <Portal />
);
