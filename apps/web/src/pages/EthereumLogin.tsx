import { useTwDid } from '@tw-did/react-library';

export function EthereumLogin() {
  const { ethereumLogin } = useTwDid();

  return (
    <div>
      <button onClick={() => ethereumLogin()}>Login</button>
    </div>
  );
}
