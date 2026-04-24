import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { ToastProvider } from './components/ToastProvider.jsx';
import { router } from './lib/routes.jsx';
import './index.css';

/**
 * @entry main
 * @description Root entry. React 18 createRoot → ErrorBoundary → ToastProvider → RouterProvider.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ErrorBoundary>
  </StrictMode>
);
