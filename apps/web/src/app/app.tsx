import { Link, Outlet } from '@tanstack/react-router';
import { authorizeRoute, indexRoute, profileRoute } from '../router';

export function App() {
  return (
    <div>
      <div className="navigation">
        <Link to={indexRoute.id}>Index</Link>{' '}
        <Link to={profileRoute.id}>Profile</Link>{' '}
        <Link to={authorizeRoute.id}>Authorize</Link>
      </div>
      <Outlet />
    </div>
  );
}

export default App;
