import { RootRoute, Route, Router } from '@tanstack/react-router';
import App from './App';
import { CredentialSelection, EthereumLogin, Register } from './pages';

const rootRoute = new RootRoute({
  component: App,
});

export const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <div>Home</div>,
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

export const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: () => <Register />,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  registerRoute,
  selectCredentialRoute,
  ethereumLoginRoute,
]);
export const router = new Router({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
