import {
  PropertyNotFountError,
  SemaphoreSignature2023,
} from './SemaphoreSignature2023';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getConstructArgs(): any {
  const agent = {
    keyManagerSign: vi
      .fn()
      .mockResolvedValue(JSON.stringify({ proof: 'proof' })),
  };
  const key = { kid: 'key-id' };

  return {
    context: { agent },
    key: key,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDocument(): any {
  return {
    credentialSubject: {
      group: '1',
    },
  };
}

describe('SemaphoreSignature2023', () => {
  it('creates a proof successfully', async () => {
    const suite = new SemaphoreSignature2023(getConstructArgs());
    const proof = await suite.createProof({
      document: getDocument(),
    });

    expect(proof.fullProof).toStrictEqual({ proof: 'proof' });
  });

  it('fails to create a proof if context is not set', async () => {
    const args = getConstructArgs();
    delete args.context;
    const suite = new SemaphoreSignature2023(args);

    expect(suite.createProof({ document: getDocument() })).rejects.toThrow(
      PropertyNotFountError
    );
  });
});
