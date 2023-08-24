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

export const authorizeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/authorize',
  component: () => <Authorize />,
});

const routeTree = rootRoute.addChildren([homeRoute, authorizeRoute]);
export const router = new Router({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
