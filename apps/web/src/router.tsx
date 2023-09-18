import { RootRoute, Route, Router } from '@tanstack/react-router';
import App from './App';
import { CredentialSelection, EthereumLogin, NationalLogin } from './pages';

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

export const nationalLoginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/national-login',
  component: () => <NationalLogin />,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  selectCredentialRoute,
  ethereumLoginRoute,
  nationalLoginRoute,
]);
export const router = new Router({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
