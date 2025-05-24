import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';

import { Toaster } from 'sonner';

import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';
import '@fontsource/geist-sans/700.css';
import '@fontsource-variable/merriweather/index.css';
import '@fontsource-variable/jetbrains-mono/index.css';
import Dashboard from './pages/Dashboard.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster
      position="top-center"
      theme="system"
      toastOptions={{
        style: {
          backgroundColor: 'var(--background)',
          borderColor: 'var(--border)',
          accentColor: 'var(--accent)',
          color: 'var(--foreground)',
        },
      }}
    />
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
