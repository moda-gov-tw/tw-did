import { Outlet } from '@tanstack/react-router';
import { Header } from '@tw-did/react-library';
// import { Header } from './libs';

export function App() {
  return (
    <div>
      <Header path={window.location.pathname} />
      <Outlet />
    </div>
  );
}

export default App;
