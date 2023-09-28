import { RegisterScreen, useAuth } from '@tw-did/react-library';
import { signMessage } from '@wagmi/core';
import { Identity } from '@semaphore-protocol/identity';
import { useNavigate } from '@tanstack/react-router';

export function Register() {
  const { user, ethereumLogin, updateSemaphoreCommitment } = useAuth();

    const handleFidoLogin = async () => {
    /* TODO: handleFidoLogin */
  };

  const handleEthLogin = async () => {
    await ethereumLogin();
  };

  const generateIdentity = async () => {
    const message = `Sign this message to generate your Semaphore identity.`;
    const result = await signMessage({ message });
    const identity = new Identity(result);
    updateSemaphoreCommitment(identity.commitment.toString());
  };

  const handleBind = async () => {
    await generateIdentity();
  };

  const navigate = useNavigate();
  function viewCredential() {
    navigate({ to: '/view-credential' });
  }

  return user ? (
    <RegisterScreen
      user={user}
      handleFidoLogin={handleFidoLogin}
      handleEthLogin={handleEthLogin}
      handleBind={handleBind}
      viewCredential={viewCredential}
    />
  ) : (
    <></>
  );
}
