import { useAuth } from '@tw-did/react-library';
import { WelcomeScreen } from '@tw-did/react-library';
import { useNavigate } from '@tanstack/react-router';
import { LoginSearch, loginRoute, registerRoute } from '../router';

export function Welcome() {
  const { user, requestLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (nationalId: string) => {
    try {
      const notifyRes = await requestLogin(nationalId, 'NOTIFY');
      const qrcodeRes = await requestLogin(nationalId, 'QRCODE');
      const loginSearch: LoginSearch = {
        nationalId,
        notification: {
          transactionId: notifyRes.transactionId,
          spTicketId: notifyRes.spTicketId,
        },
        qrcode: {
          transactionId: qrcodeRes.transactionId,
          spTicketId: qrcodeRes.spTicketId,
          spTicketPayload: qrcodeRes.spTicketPayload,
        },
      };

      if (!user?.ethereumAccount || !user?.semaphoreCommitment) {
        navigate({ to: registerRoute.id, search: loginSearch });
      } else {
        navigate({ to: loginRoute.id, search: loginSearch });
      }
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
