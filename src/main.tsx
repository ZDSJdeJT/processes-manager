import React from 'react';
import ReactDOM from 'react-dom/client';

import { Toaster } from '@/components/ui/sonner';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ThemeProvider } from '@/components/providers/theme-provider';
import App from '@/App';

import '@/styles/globals.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <Header />
      <App />
      <Footer />
      <Toaster position="bottom-left" className="pointer-events-auto" />
    </ThemeProvider>
  </React.StrictMode>,
);
