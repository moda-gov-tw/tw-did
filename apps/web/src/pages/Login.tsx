import { LoginScreen, useAuth } from '@tw-did/react-library';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { loginRoute } from '../router';

export function Login() {
  const { user } = useAuth();
  const { notification, qrcode } = useSearch({ from: loginRoute.id });

  const handleLogin = async () => {
    /* TODO: handleFidoLogin */
  };

  const navigate = useNavigate();
  function viewCredential() {
    navigate({ to: '/view-credential' });
  }

  return user ? (
    <LoginScreen
      nationID={user.nationalId}
      walletAddr="0x***********"
      spTicketPayload={qrcode.spTicketPayload}
      handleFidoLogin={handleLogin}
      viewCredential={viewCredential}
    />
  ) : (
    <></>
  );
}
