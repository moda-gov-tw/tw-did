import { MemoryPrivateKeyStore } from '@veramo/key-manager';
import {
  KeyNotFoundError,
  SemaphoreKeyManagementSystem,
  UnsupportedKeyType,
  normalizePublicKey,
} from './SemaphoreKeyManagementSystem';
import {
  SEMAPHORE_GROUP_DEPTH,
  SEMAPHORE_GROUP_ID,
  SEMAPHORE_TYPE,
} from './SemaphoreConstants';
import { Identity } from '@semaphore-protocol/identity';
import { fromString } from 'uint8arrays';

describe('SemaphoreKeyManagementSystem', () => {
  let keyStore: MemoryPrivateKeyStore;

  beforeEach(() => {
    vi.resetAllMocks();
    keyStore = new MemoryPrivateKeyStore();
  });

  it('should import a semaphore identity successfully', async () => {
    const kms = new SemaphoreKeyManagementSystem(keyStore);
    const identity = new Identity();
    const normalizedPublicKey = normalizePublicKey(
      identity.commitment.toString()
    );

    await kms.importKey({
      kid: 'key-id',
      type: SEMAPHORE_TYPE,
      privateKeyHex: identity.toString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const keys = await kms.listKeys();
    expect(keys).toHaveLength(1);
    expect(keys[0].kid).toBe('key-id');
    expect(keys[0].publicKeyHex).toBe(normalizedPublicKey);
  });

  it('should create a random key successfully', async () => {
    const kms = new SemaphoreKeyManagementSystem(keyStore);
    await kms.createKey({ type: SEMAPHORE_TYPE });

    const keys = await kms.listKeys();
    expect(keys).toHaveLength(1);
  });

  it('should fail to create a key of a non-semaphore type', async () => {
    const kms = new SemaphoreKeyManagementSystem(keyStore);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const args = { type: 'not support type' as any };
    expect(kms.createKey(args)).rejects.toThrow(UnsupportedKeyType);
  });

  it('should generate a proof by signing a challenge', async () => {
    vi.mock('@semaphore-protocol/proof', () => {
      return {
        generateProof: () => {
          return Promise.resolve({ proof: 'proof' });
        },
      };
    });

    const kms = new SemaphoreKeyManagementSystem(keyStore);
    const identity = new Identity();
    const timestamp = Date.now();

    await kms.importKey({
      kid: 'key-id',
      type: SEMAPHORE_TYPE,
      privateKeyHex: identity.toString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const data = {
      group: {
        groupId: SEMAPHORE_GROUP_ID,
        depth: SEMAPHORE_GROUP_DEPTH,
        members: [identity.commitment.toString()],
      },
      challenge: timestamp,
    };

    const proof = await kms.sign({
      keyRef: { kid: 'key-id' },
      algorithm: SEMAPHORE_TYPE,
      data: fromString(JSON.stringify(data)),
    });

    expect(JSON.parse(proof)).toEqual({ proof: 'proof' });
  });

  it('should fail if kid is incorrect', async () => {
    const kms = new SemaphoreKeyManagementSystem(keyStore);
    const identity = new Identity();

    await kms.importKey({
      kid: 'key-id',
      type: SEMAPHORE_TYPE,
      privateKeyHex: identity.toString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const payload = {
      keyRef: { kid: 'wrong-kid' },
      algorithm: SEMAPHORE_TYPE,
      data: fromString(''),
    };

    expect(kms.sign(payload)).rejects.toThrow(KeyNotFoundError);
  });

  it('should fail if algorithm is incorrect', async () => {
    const kms = new SemaphoreKeyManagementSystem(keyStore);
    const identity = new Identity();

    await kms.importKey({
      kid: 'key-id',
      type: SEMAPHORE_TYPE,
      privateKeyHex: identity.toString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const payload = {
      keyRef: { kid: 'key-id' },
      algorithm: 'INVALID_ALGORITHM',
      data: fromString(''),
    };

    expect(kms.sign(payload)).rejects.toThrow(UnsupportedKeyType);
  });
});
