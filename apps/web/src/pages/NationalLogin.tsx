import { ChangeEvent, useState } from 'react';

export function NationalLogin() {
  const [nationalId, setNationalId] = useState<string>('');

  const handleTyping = (e: ChangeEvent<HTMLInputElement>) => {
    setNationalId(e.target.value);
  };

  const handleVerify = async () => {
    const url = '/api/auth/national/verify';

    const requestBody = {
      nationalId,
      createUserIfNotExist: true,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Verification result:', result);
    } else {
      console.error('Failed to verify:', response.status, response.statusText);
    }
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
      <button onClick={() => handleVerify()}>Verify</button>
    </div>
  );
}
