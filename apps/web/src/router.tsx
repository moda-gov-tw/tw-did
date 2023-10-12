import { RootRoute, Route, Router } from '@tanstack/react-router';
import App from './App';
import {
  CredentialSelection,
  CredentialView,
  EthereumLogin,
  Login,
  Welcome,
} from './pages';
import { Semaphore } from './pages/Semaphore';
import { Register } from './pages/Register';

interface NotificationLoginParams {
  transactionId: string;
  spTicketId: string;
}

interface QrcodeLoginParams extends NotificationLoginParams {
  spTicketPayload: string;
}

export interface LoginSearch {
  nationalId: string;
  notification: NotificationLoginParams;
  qrcode: QrcodeLoginParams;
}

const rootRoute = new RootRoute({
  component: App,
});

export const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Welcome />,
});

export const viewCredentialRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/view-credential',
  component: () => <CredentialView />,
});

export const selectCredentialRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/select-credential',
  component: () => <CredentialSelection />,
});

export const ethereumLoginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/ethereum-login',
  component: () => <EthereumLogin />,
});

export const semaphoreRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'semaphore',
  component: () => <Semaphore />,
});

export const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => <Login />,
  validateSearch: (search: Record<string, any>): LoginSearch => {
    return {
      nationalId: search?.nationalId || '',
      notification: {
        transactionId: search?.notification?.transactionId || '',
        spTicketId: search?.notification?.spTicketId || '',
      },
      qrcode: {
        transactionId: search?.qrcode?.transactionId || '',
        spTicketId: search?.qrcode?.spTicketId || '',
        spTicketPayload: search?.qrcode?.spTicketPayload || '',
      },
    };
  },
});

export const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: () => <Register />,
  validateSearch: (search: Record<string, any>): LoginSearch => {
    return {
      nationalId: search?.nationalId || '',
      notification: {
        transactionId: search?.notification?.transactionId || '',
        spTicketId: search?.notification?.spTicketId || '',
      },
      qrcode: {
        transactionId: search?.qrcode?.transactionId || '',
        spTicketId: search?.qrcode?.spTicketId || '',
        spTicketPayload: search?.qrcode?.spTicketPayload || '',
      },
    };
  },
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,
  viewCredentialRoute,
  selectCredentialRoute,
  ethereumLoginRoute,
  semaphoreRoute,
]);
export const router = new Router({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
