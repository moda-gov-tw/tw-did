import { LoginScreen, useAuth } from '@tw-did/react-library';
import { useNavigate } from '@tanstack/react-router';

export function Login() {
  const { user, loginInfo } = useAuth();

  const handleLogin = async () => {
    /* TODO: handleFidoLogin */
  };

  const navigate = useNavigate();
  function viewCredential() {
    navigate({ to: '/view-credential' });
  }

  return (
    <LoginScreen
      nationID={user?.nationalId || ''}
      walletAddr="0x***********"
      spTicketPayload={loginInfo?.qrcode?.spTicketPayload || ''}
      handleFidoLogin={handleLogin}
      viewCredential={viewCredential}
    />
  );
}
