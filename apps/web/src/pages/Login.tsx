import { useAuth } from '@tw-did/react-library';
import { ChangeEvent, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export function Login() {
  const [nationalId, setNationalId] = useState<string>('');
  const [spTicketPayload, setSpTicketPayload] = useState<string>('');
  const { requestLogin, login, logout } = useAuth();

  const handleTyping = (e: ChangeEvent<HTMLInputElement>) => {
    setNationalId(e.target.value);
  };

  const handleLogin = async () => {
    const notifyRes = await requestLogin(nationalId, 'NOTIFY');
    const qrcodeRes = await requestLogin(nationalId, 'QRCODE');

    // qrcode login
    console.log('qrcode', spTicketPayload);
    setSpTicketPayload(qrcodeRes.spTicketPayload);
    login(nationalId, qrcodeRes.transactionId, qrcodeRes.spTicketId);

    // notification login
    login(nationalId, notifyRes.transactionId, notifyRes.spTicketId);
  };

  return (
    <div>
      <input
        type="text"
        name="national-id"
        id="national-id"
        onChange={handleTyping}
        value={nationalId}
      />
      <button onClick={() => handleLogin()}>Login</button>{' '}
      <button onClick={() => logout()}>Logout</button> <br />
      {spTicketPayload !== '' ? <QRCodeCanvas value={spTicketPayload} /> : ''}
    </div>
  );
}
