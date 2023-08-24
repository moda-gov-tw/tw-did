import { ChangeEvent } from 'react';

export function App() {
  const handleSelectOnDid = () => {
    console.log('Select on DID');
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
    </div>
  );
}

export default App;
