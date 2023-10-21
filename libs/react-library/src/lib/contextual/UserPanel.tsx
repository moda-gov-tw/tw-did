import { useAccount, useConfig, useConnect, useDisconnect } from 'wagmi';

export function UserPanel() {
  const { connectors } = useConfig();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: connectors[0],
  });
  const { disconnect } = useDisconnect();

  const renderConnection = () => {
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
  };

  return (
    <div>
      connection status:
      <span>{renderConnection()}</span>
    </div>
  );
}
