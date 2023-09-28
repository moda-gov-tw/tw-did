import './global';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { ApplicationContext } from './contexts/ApplicationContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <ApplicationContext>
      <RouterProvider router={router} />
    </ApplicationContext>
  </StrictMode>
);
