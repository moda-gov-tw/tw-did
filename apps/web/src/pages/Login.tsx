import { LoginScreen, useAuth } from '@tw-did/react-library';
import { useNavigate } from '@tanstack/react-router';

export function Login() {
  const { user} = useAuth();

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
      handleFidoLogin={handleLogin}
      viewCredential={viewCredential}
    />
  ) : (
    <></>
  );
}
