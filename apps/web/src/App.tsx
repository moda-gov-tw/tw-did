import { Outlet } from '@tanstack/react-router';
import { Header } from './libs';

export function App() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
