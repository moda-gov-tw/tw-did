import { TwDidService } from '@tw-did/core';
import { ChangeEvent, useState } from 'react';
import {
  DID_CLIENT_NAME,
  DID_KMS,
  DID_PROVIDER,
  getAgent,
} from '../veramo/setup';
import { UserPanel } from '@tw-did/react-library';
import { useAccount } from 'wagmi';
import { MinimalImportableKey, VerifiableCredential } from '@veramo/core';

enum VerificationResult {
  Verified = 'Verified',
  NotVerified = 'Not Verified',
  Pending = 'Pending',
}

export function App() {
  const { address } = useAccount();
  const [credential, setCredential] = useState<string>('');
  const [didDoc, setDidDoc] = useState<string>('');
  const [presentation, setPresentation] = useState<string>('');
  const [verified, setVerified] = useState<VerificationResult>(
    VerificationResult.Pending
  );

  const setPayload = async (cred: VerifiableCredential) => {
    const agent = await getAgent();
    setCredential(JSON.stringify(cred, null, 2));
    const didUrl = cred.credentialSubject.id || '';
    const doc = await agent.resolveDid({ didUrl });
    setDidDoc(JSON.stringify(doc, null, 2));
  };

  const handleSelectOnDid = async () => {
    // tw did service host
    const serviceHost = 'http://localhost:4201';
    const service = new TwDidService(serviceHost);
    const msg = await service.selectCredential();
    if (msg.payload) {
      setPayload(msg.payload);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event: ProgressEvent<FileReader>) {
      if (event.target?.result) {
        const payload = JSON.parse(
          event?.target.result as string
        ) as VerifiableCredential;
        if (payload) {
          setPayload(payload);
        }
      }
    };
    reader.readAsText(file);
  };

  // verify via ethereum injected wallet and issue a verifiable presentation
  const handleVerify = async () => {
    const agent = await getAgent();
    const didUri = `${DID_PROVIDER}:${address}`;
    const controllerKeyId = `${DID_CLIENT_NAME}-${address}`;

    await agent.didManagerImport({
      did: didUri,
      provider: DID_PROVIDER,
      controllerKeyId,
      keys: [
        {
          kid: controllerKeyId,
          type: 'Secp256k1',
          kms: DID_KMS,
          privateKeyHex: '',
          publicKeyHex: '',
          meta: {
            account: address,
            provider: DID_CLIENT_NAME,
            algorithms: ['eth_signMessage', 'eth_signTypedData'],
          },
        } as MinimalImportableKey,
      ],
    });

    const cred = JSON.parse(credential) as VerifiableCredential;

    const vp = await agent.createVerifiablePresentation({
      presentation: {
        holder: didUri,
        verifiableCredential: [cred],
      },
      proofFormat: 'EthereumEip712Signature2021',
    });
    setPresentation(JSON.stringify(vp, null, 2));

    const result = await agent.verifyPresentation({ presentation: vp });
    setVerified(
      result.verified && cred.credentialSubject.id === vp.holder
        ? VerificationResult.Verified
        : VerificationResult.NotVerified
    );
  };

  const renderVerificationResult = (result: VerificationResult) => {
    if (result === VerificationResult.Pending) {
      return <span data-testid="verification-pending">Pending</span>;
    } else if (result === VerificationResult.Verified) {
      return <span data-testid="verification-succeeds">Verified</span>;
    } else {
      return <span data-testid="verification-fails">Not Verified</span>;
    }
  };

  return (
    <div>
      <UserPanel />
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
      <h2>Subject DID Document</h2>
      <pre>{didDoc}</pre>
      <h2>Verifiable Presentation</h2>
      <pre>{presentation}</pre>
      <h2>Verification result: {renderVerificationResult(verified)}</h2>
      <button data-testid="verify-credential" onClick={handleVerify}>
        Verify
      </button>
    </div>
  );
}

export default App;
