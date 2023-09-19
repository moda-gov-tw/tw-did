import { Identity } from '@semaphore-protocol/identity';
import { useAuth } from '@tw-did/react-library';
import { signMessage } from '@wagmi/core';

export function Semaphore() {
  const { updateSemaphoreCommitment } = useAuth();

  const generateIdentity = async () => {
    const message = `Sign this message to generate your Semaphore identity.`;
    const result = await signMessage({ message });
    const identity = new Identity(result);
    updateSemaphoreCommitment(identity.commitment.toString());
  };

  return (
    <div>
      <button onClick={() => generateIdentity()}>
        Generate Semaphore identity and bind
      </button>
    </div>
  );
}
