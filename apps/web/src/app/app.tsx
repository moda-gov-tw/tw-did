import { Profile } from '@tw-did/react-library';
import { ApplicationContext } from './ApplicationContext';

export function App() {
  return (
    <ApplicationContext>
      <div>
        <Profile />
      </div>
    </ApplicationContext>
  );
}

export default App;
