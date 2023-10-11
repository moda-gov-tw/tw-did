import { LoginScreen, useAuth } from '@tw-did/react-library';
import { useNavigate } from '@tanstack/react-router';

export function Login() {
  const { user } = useAuth();

  const handleLogin = async () => {
    /* TODO: handleFidoLogin */
  };

  // const handleLogin = async () => {
  //   const notifyRes = await requestLogin(nationalId, 'NOTIFY');
  //   const qrcodeRes = await requestLogin(nationalId, 'QRCODE');

  //   // qrcode login
  //   console.log('qrcode', spTicketPayload);
  //   setSpTicketPayload(qrcodeRes.spTicketPayload);
  //   login(nationalId, qrcodeRes.transactionId, qrcodeRes.spTicketId);

  //   // notification login
  //   login(nationalId, notifyRes.transactionId, notifyRes.spTicketId);
  // };

  const navigate = useNavigate();
  function viewCredential() {
    navigate({ to: '/view-credential' });
  }

  return user ? (
    <LoginScreen
      nationID={user.nationalId}
      walletAddr="0x***********"
      fidoQR="/sampleQR.jpg" /* TODO: use fido QR code */
      handleFidoLogin={handleLogin}
      viewCredential={viewCredential}
    />
  ) : (
    <></>
  );
}
