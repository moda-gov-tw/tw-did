import { useAuth } from '@tw-did/react-library';

export function EthereumLogin() {
  const { ethereumLogin } = useAuth();

  return (
    <div>
      <button onClick={() => ethereumLogin()}>Login</button>
    </div>
  );
}
