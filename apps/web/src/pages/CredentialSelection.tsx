import { MessageAction } from '@tw-did/core';
import { CredentialCardList, CredentialScreen, useCredentials } from '@tw-did/react-library';
import { useAccount } from 'wagmi';

export function CredentialSelection() {
  const { isConnected } = useAccount();
  const { credentials, sendCredential } = useCredentials();

  if (isConnected)
    return (
      <div>
        <CredentialScreen onRevoke={()=>{}}/>
        {/* <CredentialCardList
          credentials={credentials}
          actionLabels={['select']}
          onAction={(index, label) => {
            if (label !== 'select') return;

            sendCredential(MessageAction.SELECT_CREDENTIAL, credentials[index]);
          }}
        />
        <button
          data-testid="cancel-button"
          onClick={() => sendCredential(MessageAction.CANCEL_SELECT_CREDENTIAL)}
        >
          Cancel
        </button> */}
      </div>
    );
}
