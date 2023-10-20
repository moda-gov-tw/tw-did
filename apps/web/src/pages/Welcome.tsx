import { useTwDid } from '@tw-did/react-library';
import { WelcomeScreen } from '@tw-did/react-library';
import { useNavigate } from '@tanstack/react-router';
import { registerRoute } from '../router';

export function Welcome() {
  const { user, requestLogin } = useTwDid();
  const navigate = useNavigate();

  const handleLogin = async (nationalId: string) => {
    try {
      await requestLogin(nationalId);
      navigate({ to: registerRoute.id });
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  return (
    <WelcomeScreen
      nationalId={user?.nationalId || ''} // use user nationalId if logined before
      handleRegister={handleLogin}
    />
  );
}
