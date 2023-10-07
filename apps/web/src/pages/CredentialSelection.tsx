import { MessageAction } from '@tw-did/core';
import { CredentialScreen, useCredentials } from '@tw-did/react-library';
import { useAccount } from 'wagmi';

export function CredentialSelection() {
  const { isConnected } = useAccount();
  const { credentials, sendCredential } = useCredentials();

  if (isConnected)
    return (
      <div>
        <CredentialScreen
          credentials={credentials}
          actionLabels={['select']}
          onAction={(index, label) => {
            if (label !== 'select') return;
            sendCredential(MessageAction.SELECT_CREDENTIAL, credentials[index]);
          }}
          checkLogin={()=>true}
        />
      </div>
    );
}
