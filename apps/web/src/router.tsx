import { RootRoute, Route, Router } from '@tanstack/react-router';
import App from './app/app';
import { Profile } from '@tw-did/react-library';

const rootRoute = new RootRoute({
  component: App,
});

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <div>Index</div>,
});

export const profileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: Profile,
});

const routeTree = rootRoute.addChildren([indexRoute, profileRoute]);
export const router = new Router({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
