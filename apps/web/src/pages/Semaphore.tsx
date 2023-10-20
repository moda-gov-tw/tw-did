import { useTwDid } from '@tw-did/react-library';

export function Semaphore() {
  const { updateSemaphoreCommitment, generateSemaphoreIdentity } = useTwDid();

  const handleClick = async () => {
    const identity = await generateSemaphoreIdentity();
    updateSemaphoreCommitment(identity.commitment.toString());
  };

  return (
    <div>
      <button onClick={() => handleClick()}>
        Generate Semaphore identity and bind
      </button>
    </div>
  );
}
