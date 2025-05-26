import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';

import { Toaster } from 'sonner';

import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';
import '@fontsource/geist-sans/700.css';
import '@fontsource-variable/merriweather/index.css';
import '@fontsource-variable/jetbrains-mono/index.css';
import { AuthProvider } from './context/AuthProvider.tsx';
import { SignIn } from './pages/SignIn.tsx';
import { SignUp } from './pages/SignUp.tsx';

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
      <AuthProvider>
        <Routes>
          <Route index element={<App />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
