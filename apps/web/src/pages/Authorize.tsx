import { CredentialCardList, useCredentials } from '@tw-did/react-library';
import { useAccount } from 'wagmi';

export function Authorize() {
  const { isConnected } = useAccount();
  const { credentialViews: credentials } = useCredentials();

  if (isConnected)
    return (
      <div>
        <CredentialCardList
          credentialViews={credentials}
          actionLabels={['select']}
          onAction={(index, label) => {
            console.log(`Selected credential ${index} with action ${label}`);
          }}
        />
      </div>
    );
}
