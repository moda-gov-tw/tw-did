import { useAuth } from '@tw-did/react-library';
import { WelcomeScreen } from '@tw-did/react-library';
import { useNavigate } from '@tanstack/react-router';

export function Welcome() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (nationalId: string) => {
    try {
      await register(nationalId, 'password');
    } catch (e) {
      console.log(e);
      throw e;
    }
    /* TODO: redirect to login if already registered */
    let registered = false;
    if (user?.ethereumAccount) navigate({ to: '/login' });
    else navigate({ to: '/register' });
    return;
  };

  return (
    <>
      <WelcomeScreen
        nationalId={user?.nationalId || ''} // use user nationalId if logined before
        handleRegister={handleRegister}
      />
    </>
  );
}
