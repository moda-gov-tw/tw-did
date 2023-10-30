import { Identity } from '@semaphore-protocol/identity';
import {
  CommitmentsDto,
  SEMAPHORE_CONTEXT_URI,
  SEMAPHORE_GROUP_DEPTH,
  SEMAPHORE_GROUP_ID,
  SEMAPHORE_HIDDEN_PUBLIC_KEY,
  SEMAPHORE_TYPE,
  TwDidService,
} from '@tw-did/core';
import { ChangeEvent, useState } from 'react';
import {
  DID_CLIENT_NAME,
  WEB3_KMS,
  ETHR_DID_PROVIDER,
  getAgent,
  SEMAPHORE_KMS,
} from '../veramo/setup';
import { UserPanel } from '@tw-did/react-library';
import { useAccount } from 'wagmi';
import { signMessage } from '@wagmi/core';
import {
  CredentialPayload,
  MinimalImportableKey,
  VerifiableCredential,
} from '@veramo/core';

enum VerificationResult {
  Verified = 'Verified',
  Revoked = 'Revoked',
  NotVerified = 'Not Verified',
  Pending = 'Pending',
}

function createSemaphoreCrdentialContent(
  issuer: string,
  members: string[]
): CredentialPayload {
  const credential: CredentialPayload = {
    '@context': [SEMAPHORE_CONTEXT_URI],
    issuer: issuer,
    credentialSubject: {
      groupId: SEMAPHORE_GROUP_ID,
      depth: SEMAPHORE_GROUP_DEPTH,
      members,
    },
  };
  return credential;
}

export function App() {
  const { address } = useAccount();
  const [credential, setCredential] = useState<string>('');
  const [didDoc, setDidDoc] = useState<string>('');
  const [presentation, setPresentation] = useState<string>('');
  const [verified, setVerified] = useState<VerificationResult>(
    VerificationResult.Pending
  );
  const [semaphoreCredential, setSemaphoreCredential] = useState<string>('');
  const [semaphoreVerified, setSemaphoreVerified] =
    useState<VerificationResult>(VerificationResult.Pending);

  const setPayload = async (cred: VerifiableCredential) => {
    const agent = await getAgent();
    setCredential(JSON.stringify(cred, null, 2));
    const didUrl = cred.credentialSubject.id || '';
    const doc = await agent.resolveDid({ didUrl });
    setDidDoc(JSON.stringify(doc, null, 2));
  };

  const handleSelectOnDid = async () => {
    // tw did service host
    const serviceHost = 'http://localhost:3000';
    const service = new TwDidService(serviceHost);
    const msg = await service.selectCredential(window);
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

  const generateSemaphoreIdentity = async () => {
    const message = `Sign this message to generate your Semaphore identity.`;
    const result = await signMessage({ message });
    return new Identity(result);
  };

  const handleSemaphore = async () => {
    const identity = await generateSemaphoreIdentity();

    const agent = await getAgent();
    const holder = await agent.didManagerImport({
      did: 'did:web:tw-did.github.io:hidden',
      provider: 'did:web',
      keys: [
        {
          kid: 'default',
          kms: SEMAPHORE_KMS,
          type: SEMAPHORE_TYPE,
          privateKeyHex: identity.toString(),
          publicKeyHex: SEMAPHORE_HIDDEN_PUBLIC_KEY,
        },
      ],
    });

    const commitments: CommitmentsDto = await fetch(
      `http://localhost:3000/api/users/commitments`
    ).then((res) => res.json());

    let verifiableCredential: VerifiableCredential;
    try {
      verifiableCredential = await agent.createVerifiableCredential({
        credential: createSemaphoreCrdentialContent(
          holder.did,
          commitments.activated
        ),
        proofFormat: 'lds',
      });
      setSemaphoreCredential(JSON.stringify(verifiableCredential, null, 2));
      const verified = await agent.verifyCredential({
        credential: verifiableCredential,
      });
      setSemaphoreVerified(
        verified.verified
          ? VerificationResult.Verified
          : VerificationResult.NotVerified
      );
      console.log(verified);
    } catch (e) {
      // the identity is not in the group, try revoked group
      verifiableCredential = await agent.createVerifiableCredential({
        credential: createSemaphoreCrdentialContent(
          holder.did,
          commitments.revoked
        ),
        proofFormat: 'lds',
      });
      setSemaphoreCredential(JSON.stringify(verifiableCredential, null, 2));
      const verified = await agent.verifyCredential({
        credential: verifiableCredential,
      });
      setSemaphoreVerified(
        verified.verified
          ? VerificationResult.Revoked
          : VerificationResult.NotVerified
      );
      console.log(verified);
    }
  };

  // verify via ethereum injected wallet and issue a verifiable presentation
  const handleVerify = async () => {
    const agent = await getAgent();
    const didUri = `${ETHR_DID_PROVIDER}:${address}`;
    const controllerKeyId = `${DID_CLIENT_NAME}-${address}`;

    await agent.didManagerImport({
      did: didUri,
      provider: ETHR_DID_PROVIDER,
      controllerKeyId,
      keys: [
        {
          kid: controllerKeyId,
          type: 'Secp256k1',
          kms: WEB3_KMS,
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
    const revocationResult = await agent.checkCredentialStatus({
      credential: cred,
    });

    let finalResult = VerificationResult.NotVerified;
    if (revocationResult.revoked) {
      finalResult = VerificationResult.Revoked;
    } else if (
      result.verified &&
      cred.credentialSubject.id?.toLowerCase() === vp.holder.toLowerCase()
    ) {
      finalResult = VerificationResult.Verified;
    }

    setVerified(finalResult);
  };

  const renderVerificationResult = (result: VerificationResult) => {
    if (result === VerificationResult.Pending) {
      return <span data-testid="verification-pending">Pending</span>;
    } else if (result === VerificationResult.Verified) {
      return <span data-testid="verification-succeeds">Verified</span>;
    } else if (result === VerificationResult.Revoked) {
      return <span data-testid="verification-fails">Revoked</span>;
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
      <h2>Semaphore Credential</h2>
      <button
        data-testid="semaphore-challenge-verify"
        onClick={handleSemaphore}
      >
        Semaphore challenge and verify
      </button>
      <h2>Semaphore Credential</h2>
      <pre>{semaphoreCredential}</pre>
      <h2>Semaphore Verification</h2>
      <pre>{semaphoreVerified}</pre>
    </div>
  );
}

export default App;
