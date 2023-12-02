import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { appWindow } from '@tauri-apps/api/window';
import Portal from './Portal';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // Re add strict mode
  appWindow.label === 'main' ? <App /> : <Portal />
);
