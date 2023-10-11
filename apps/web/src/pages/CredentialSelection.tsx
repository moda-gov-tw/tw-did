import { MessageAction } from '@tw-did/core';
import { CredentialScreen, useCredentials } from '@tw-did/react-library';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';

export function CredentialSelection() {
  const { isConnected } = useAccount();
  const { credentials, sendCredential } = useCredentials();
  const checkLogin = useCallback(() => true, []);

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
          checkLogin={checkLogin}
        />
      </div>
    );
}
