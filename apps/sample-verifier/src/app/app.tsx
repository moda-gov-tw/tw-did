import { TwDidService } from '@tw-did/core';
import { ChangeEvent, useState } from 'react';

export function App() {
  const [credential, setCredential] = useState<string>('');

  const handleSelectOnDid = async () => {
    // tw did service host
    const serviceHost = 'http://localhost:4201';
    const service = new TwDidService(serviceHost);
    const msg = await service.selectCredential();
    setCredential(JSON.stringify(msg, null, 2));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event: ProgressEvent<FileReader>) {
      if (event.target?.result) {
        console.log(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <button data-testid="select-on-did" onClick={handleSelectOnDid}>
        Select on DID
      </button>
      <br />
      <label htmlFor="credential-file">Select credential file: </label>
      <input
        type="file"
        data-testid="credential-file"
        onChange={handleFileChange}
      />
      <h2>Credential</h2>
      <pre>{credential}</pre>
    </div>
  );
}

export default App;
