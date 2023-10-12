import { RegisterScreen, useAuth } from '@tw-did/react-library';
import { signMessage } from '@wagmi/core';
import { Identity } from '@semaphore-protocol/identity';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { registerRoute } from '../router';

export function Register() {
  const { user, login, ethereumLogin, updateSemaphoreCommitment } = useAuth();
  const { nationalId, notification, qrcode } = useSearch({
    from: registerRoute.id,
  });

  const ethereumAccount = user?.ethereumAccount || '';

  const handleFidoLogin = () => {
    // qrcode login
    const loginPromise = login(
      nationalId,
      qrcode.transactionId,
      qrcode.spTicketId
    );

    // notification login
    const notifyPromise = login(
      nationalId,
      notification.transactionId,
      notification.spTicketId
    );

    return Promise.race([loginPromise, notifyPromise]);
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

  return (
    <RegisterScreen
      nationalId={nationalId}
      ethereumAccount={ethereumAccount}
      spTicketPayload={qrcode.spTicketPayload}
      handleFidoLogin={handleFidoLogin}
      handleEthLogin={handleEthLogin}
      handleBind={handleBind}
      viewCredential={viewCredential}
    />
  );
}
