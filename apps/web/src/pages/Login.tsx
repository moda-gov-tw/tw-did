import { useAuth } from '@tw-did/react-library';
import { ChangeEvent, useState } from 'react';

export function Login() {
  const [nationalId, setNationalId] = useState<string>('');
  const { login, logout } = useAuth();

  const handleTyping = (e: ChangeEvent<HTMLInputElement>) => {
    setNationalId(e.target.value);
  };

  const handleLogin = async () => {
    await login(nationalId, 'password');
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
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
