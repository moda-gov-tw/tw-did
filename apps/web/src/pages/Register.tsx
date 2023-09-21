import { RegisterScreen, useAuth } from '@tw-did/react-library';
import { ChangeEvent, useState } from 'react';

export function Register() {
  const [nationalId, setNationalId] = useState<string>('');
  const { register } = useAuth();

  const handleTyping = (e: ChangeEvent<HTMLInputElement>) => {
    setNationalId(e.target.value);
  };

  const handleRegister = async () => {
    await register(nationalId, 'password');
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
      <button onClick={() => handleRegister()}>Register</button>
      <RegisterScreen nationID={nationalId} />
    </div>
  );
}
