import { useAuth } from '@tw-did/react-library';
import { WelcomeScreen } from '@tw-did/react-library';
import { useNavigate } from '@tanstack/react-router';

export function Welcome() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (nationalId: string) => {
    navigate({ to: '/register' });
    return;
  };

  const handleLogin = async (nationalId: string) => {
    navigate({ to: '/login' });
    return;
  };

  return (
    <>
      <WelcomeScreen
        nationalId={user?.nationalId || ''} // use user nationalId if logined before
        handleRegister={handleRegister}
        handleLogin={handleLogin}
      />
    </>
  );
}
