import { RootRoute, Route, Router } from '@tanstack/react-router';
import App from './App';
import { CredentialSelection, CredentialView, Welcome } from './pages';

const rootRoute = new RootRoute({
  component: App,
});

export const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Welcome />,
});

export const selectCredentialRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/select-credential',
  component: () => <CredentialSelection />,
});
export const viewCredentialRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/view-credential',
  component: () => <CredentialView />,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  selectCredentialRoute,
]);
export const router = new Router({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
