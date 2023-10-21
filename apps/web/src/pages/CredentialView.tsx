import {
  CredentialScreen,
  CredentialType,
  useTwDid,
  useCredentials,
  CredentialMode,
  ActionId,
} from '@tw-did/react-library';
import { VerifiableCredential } from '@veramo/core-types';
import { useNavigate } from '@tanstack/react-router';
import { MessageAction } from '@tw-did/core';

export function CredentialView() {
  const {
    logout,
    user,
    getEthereumVerifiableCredential,
    generateSemaphoreVerifiableCredential,
    getSemaphoreGroup,
    generateSemaphoreIdentity,
  } = useTwDid();
  const credentials = useCredentials(
    CredentialMode.List,
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
      if (actionId === ActionId.DOWNLOAD || actionId === ActionId.GENERATE) {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
          JSON.stringify(vc)
        )}`;
        const link = document.createElement('a');
        link.href = jsonString;
        link.download = `vc-${credentialKey}.json`;
        link.click();
      }
    }
  };

  const handleRevoke = async () => {
    /* TODO: handle revoke */
  };

  const handleLogout = async () => {
    await logout();
  };

  const navigate = useNavigate();
  const handleClose = async () => {
    navigate({ to: '/' });
  };

  return (
    <div>
      <CredentialScreen
        credentials={credentials}
        onAction={(credentialKey, actionId) => {
          handleAction(credentialKey, actionId);
        }}
        onRevoke={handleRevoke}
        onLogout={handleLogout}
        onClose={handleClose}
      />
    </div>
  );
}
