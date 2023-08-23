import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useCredentials } from '../context';
import { CredentialCardList } from '../../';

export function Profile() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { credentialViews: credentials } = useCredentials();

  if (isConnected)
    return (
      <div>
        Connected to <span data-testid="address">{address}</span>
        <button data-testid="disconnect-button" onClick={() => disconnect()}>
          Disconnect
        </button>
        <CredentialCardList
          credentialViews={credentials}
          actionLabels={['select']}
          onAction={(index, label) => {
            console.log(`Selected credential ${index} with action ${label}`);
          }}
        />
      </div>
    );
  return (
    <button data-testid="connect-button" onClick={() => connect()}>
      Connect Wallet
    </button>
  );
}
