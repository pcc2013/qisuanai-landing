// D:\nira-app\src\main.tsx

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// 全局错误捕获
window.onerror = (message, source, lineno, colno, error) => {
  console.error('[Global Error]', { message, source, lineno, colno, error });
  try {
    const errors = JSON.parse(localStorage.getItem('nira-error-log') || '[]');
    errors.push({
      message: String(message),
      source: String(source),
      lineno,
      colno,
      stack: error?.stack,
      time: new Date().toISOString(),
    });
    if (errors.length > 20) errors.shift();
    localStorage.setItem('nira-error-log', JSON.stringify(errors));
  } catch {}
};

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Rejection]', event.reason);
  try {
    const errors = JSON.parse(localStorage.getItem('nira-error-log') || '[]');
    errors.push({
      message: 'Unhandled Promise: ' + String(event.reason),
      stack: event.reason?.stack,
      time: new Date().toISOString(),
    });
    if (errors.length > 20) errors.shift();
    localStorage.setItem('nira-error-log', JSON.stringify(errors));
  } catch {}
});

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}