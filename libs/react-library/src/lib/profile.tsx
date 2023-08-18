import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export function Profile() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  if (isConnected)
    return (
      <div>
        Connected to <span data-testid="address">{address}</span>
        <button data-testid="disconnect-button" onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    );
  return (
    <button data-testid="connect-button" onClick={() => connect()}>
      Connect Wallet
    </button>
  );
}
