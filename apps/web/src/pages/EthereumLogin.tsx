import { SiweMessage } from 'siwe';
import { getAddress } from 'viem';

export function EthereumLogin() {
  const handleLogin = async () => {
    const options = { method: 'POST' };
    const url = '/api/auth/challenge';
    const { value } = await fetch(url, options).then((res) => res.json());

    if (window.ethereum) {
      const [account] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const address = getAddress(account);
      const rawMessage = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: 1,
        nonce: value,
      });

      const message = rawMessage.prepareMessage() as `0x${string}`;
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });
      console.log('signature', signature);
      console.log('message', rawMessage);

      const result = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ message, signature }),
      }).then((res) => res.json());

      console.log(result);
    }
  };

  return (
    <div>
      <button onClick={() => handleLogin()}>Login</button>
    </div>
  );
}
