import { MessageAction } from '@tw-did/core';
import {
  CredentialScreen,
  CredentialType,
  useTwDid,
  useCredentials,
  CredentialMode,
  ActionId,
} from '@tw-did/react-library';
import { VerifiableCredential } from '@veramo/core-types';
import { useAccount } from 'wagmi';

export function CredentialSelection() {
  const {
    user,
    getEthereumVerifiableCredential,
    generateSemaphoreVerifiableCredential,
    getSemaphoreGroup,
    generateSemaphoreIdentity,
    sendCredential,
  } = useTwDid();
  const { isConnected } = useAccount();
  const credentials = useCredentials(
    CredentialMode.Select,
    user?.nationalId,
    user?.ethereumAccount
  );

  const handleAction = async (
    credentialKey: CredentialType,
    actionId: ActionId
  ) => {
    let vc: VerifiableCredential | null = null;
    if (credentialKey === CredentialType.ETHEREUM) {
      vc = await getEthereumVerifiableCredential();
    } else if (credentialKey === CredentialType.SEMAPHORE) {
      const identity = await generateSemaphoreIdentity();
      const group = await getSemaphoreGroup();

      vc = await generateSemaphoreVerifiableCredential(identity, group);
    }

    if (vc) {
      if (actionId === ActionId.SELECT) {
        sendCredential(MessageAction.SELECT_CREDENTIAL, vc);
      }
    }
  };

  if (isConnected)
    return (
      <div>
        <CredentialScreen credentials={credentials} onAction={handleAction} />
      </div>
    );
}
