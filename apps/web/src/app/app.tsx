import { EthereumProvider, Profile } from '@tw-did/react-library';

export function App() {
  return (
    <EthereumProvider>
      <div>
        <Profile />
      </div>
    </EthereumProvider>
  );
}

export default App;
