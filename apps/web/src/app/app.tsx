import { Link, Outlet } from '@tanstack/react-router';
import { ApplicationContext } from './ApplicationContext';
import { indexRoute, profileRoute } from '../router';

export function App() {
  return (
    <ApplicationContext>
      <div>
        <div className="navigation">
          <Link to={indexRoute.path}>Index</Link>{' '}
          <Link to={profileRoute.path}>Profile</Link>
        </div>
        <Outlet />
      </div>
    </ApplicationContext>
  );
}

export default App;
