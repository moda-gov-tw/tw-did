import {
  MinimalImportableKey,
  ManagedKeyInfo,
  TKeyType,
  IKey,
  RequireOnly,
} from '@veramo/core-types';
import {
  AbstractKeyManagementSystem,
  AbstractPrivateKeyStore,
  ManagedPrivateKey,
} from '@veramo/key-manager';
import { Identity } from '@semaphore-protocol/identity';
import { Group } from '@semaphore-protocol/group';
import { SnarkArtifacts, generateProof } from '@semaphore-protocol/proof';
import { bytesToHex, hexToBytes } from '@veramo/utils';
import { toString } from 'uint8arrays';
import { SEMAPHORE_TYPE } from './SemaphoreConstants';
import { GroupInfo } from './SemaphoreTypes';
import { join } from 'path';

/**
 * Normalizes the format of a public key to ensure compatibility with@veramo/credential-ld.
 *
 * The normalization approach is aligned with how @veramo/credential-ld does it in
 * its `findSigningKeyWithId()` function located in `src/action-handler.ts`.
 * This is necessary to ensure that the public key matches during comparison.
 *
 * @param publicKey - The public key as a hex string.
 * @returns The normalized public key as a hex string.
 */
export function normalizePublicKey(publicKey: string) {
  return bytesToHex(hexToBytes(publicKey));
}

function getSemaphoreArtifacts(): SnarkArtifacts | undefined {
  if (typeof window !== 'undefined') {
    return undefined;
  } else {
    return {
      zkeyFilePath: `${__dirname}/./assets/semaphore.zkey`,
      wasmFilePath: `${__dirname}/./assets/semaphore.wasm`,
    };
  }
}

export class UnsupportedKeyType extends Error {
  constructor(type: string | TKeyType) {
    super(`Unsupported key type: ${type}`);
    this.name = 'UnsupportedKeyType';
  }
}

export class KeyNotFoundError extends Error {
  constructor(kid: string) {
    super(`Key not found: ${kid}`);
    this.name = 'KeyNotFoundError';
  }
}

export type SignArgs = {
  keyRef: Pick<IKey, 'kid'>;
  algorithm?: string;
  data: Uint8Array;
};

type SignPayload = {
  group: GroupInfo;
  challenge: number;
};

export class SemaphoreKeyManagementSystem extends AbstractKeyManagementSystem {
  private readonly keyStore: AbstractPrivateKeyStore;

  constructor(keyStore: AbstractPrivateKeyStore) {
    super();
    this.keyStore = keyStore;
  }

  override async importKey(
    args: Exclude<MinimalImportableKey, 'kms'>
  ): Promise<ManagedKeyInfo> {
    const managedKey = this.asManagedKeyInfo({ alias: args.kid, ...args });
    await this.keyStore.importKey({ alias: managedKey.kid, ...args });

    return managedKey;
  }

  override async listKeys(): Promise<ManagedKeyInfo[]> {
    const privateKeys = await this.keyStore.listKeys({});
    const managedKeys = privateKeys.map((key) => this.asManagedKeyInfo(key));
    return managedKeys;
  }

  override async createKey(args: {
    type: TKeyType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meta?: any;
  }): Promise<ManagedKeyInfo> {
    const { type } = args;

    if (type !== SEMAPHORE_TYPE) {
      throw new UnsupportedKeyType(type);
    }

    const identity = new Identity();
    const key = await this.importKey({
      type,
      privateKeyHex: identity.toString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    return key;
  }

  override deleteKey(args: { kid: string }): Promise<boolean> {
    return this.keyStore.deleteKey({ alias: args.kid });
  }

  override async sign({ keyRef, algorithm, data }: SignArgs): Promise<string> {
    let managedKey: ManagedPrivateKey;

    try {
      managedKey = await this.keyStore.getKey({ alias: keyRef.kid });
    } catch (e) {
      throw new KeyNotFoundError(keyRef.kid);
    }

    if (algorithm !== SEMAPHORE_TYPE) {
      throw new UnsupportedKeyType(algorithm || '');
    }

    const identity = new Identity(managedKey.privateKeyHex);
    const payload: SignPayload = JSON.parse(toString(data));
    const { id, depth, members } = payload.group;
    const { challenge } = payload;

    const group = new Group(id, depth, members);

    const proof = await generateProof(
      identity,
      group,
      challenge,
      challenge,
      getSemaphoreArtifacts()
    );

    return JSON.stringify(proof);
  }

  override sharedSecret(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  private asManagedKeyInfo(
    args: RequireOnly<ManagedPrivateKey, 'privateKeyHex' | 'type'>
  ): ManagedKeyInfo {
    const { commitment } = new Identity(args.privateKeyHex);
    const originalPublicKeyHex = (args as any).publicKeyHex;
    const publicKeyHex =
      originalPublicKeyHex || normalizePublicKey(commitment.toString());
    const key = {
      type: args.type,
      kid: args.alias || publicKeyHex,
      publicKeyHex: publicKeyHex,
    };

    return key as ManagedKeyInfo;
  }
}
