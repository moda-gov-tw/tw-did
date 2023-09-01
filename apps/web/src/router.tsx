import { RootRoute, Route, Router } from '@tanstack/react-router';
import App from './App';
import { Authorize } from './pages';

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
  component: () => <Authorize />,
});

const routeTree = rootRoute.addChildren([homeRoute, selectCredentialRoute]);
export const router = new Router({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
