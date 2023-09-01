import {
  TKeyType,
  IKey,
  ManagedKeyInfo,
  MinimalImportableKey,
} from '@veramo/core-types';
import { AbstractKeyManagementSystem } from '@veramo/key-manager';
import { WalletClient, bytesToString, getAddress } from 'viem';

export class WalletClientKeyManagementSystem extends AbstractKeyManagementSystem {
  constructor(private clients: Record<string, WalletClient>) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createKey({ type }: { type: TKeyType }): Promise<ManagedKeyInfo> {
    throw Error(
      'not_supported: Web3KeyManagementSystem cannot create new keys'
    );
  }

  async importKey(
    args: Omit<MinimalImportableKey, 'kms'>
  ): Promise<ManagedKeyInfo> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return args as any as ManagedKeyInfo;
  }

  async listKeys(): Promise<ManagedKeyInfo[]> {
    const keys: ManagedKeyInfo[] = [];
    for (const clientKey in this.clients) {
      const addresses = await this.clients[clientKey].getAddresses();
      for (const addr of addresses) {
        const key: ManagedKeyInfo = {
          kid: `${clientKey}-${addr}`,
          type: 'Secp256k1',
          publicKeyHex: '',
          kms: '',
          meta: {
            account: addr,
            provider: clientKey,
            algorithms: ['eth_signMessage', 'eth_signTypedData'],
          },
        };
        keys.push(key);
      }
    }
    return keys;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sharedSecret(args: {
    myKeyRef: Pick<IKey, 'kid'>;
    theirKey: Pick<IKey, 'type' | 'publicKeyHex'>;
  }): Promise<string> {
    throw Error('not_implemented: Web3KeyManagementSystem sharedSecret');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deleteKey(args: { kid: string }) {
    // this kms doesn't need to delete keys
    return true;
  }

  private getWalletClientByKeyRef(keyRef: Pick<IKey, 'kid'>): {
    account: `0x${string}`;
    client: WalletClient;
  } {
    const [providerName, account] = keyRef.kid.split('-');
    if (!this.clients[providerName]) {
      throw Error(`not_available: provider ${providerName}`);
    }
    const client = this.clients[providerName];
    return { client, account: getAddress(account) };
  }

  async sign({
    keyRef,
    algorithm,
    data,
  }: {
    keyRef: Pick<IKey, 'kid'>;
    algorithm?: string;
    data: Uint8Array;
  }): Promise<string> {
    if (algorithm) {
      if (algorithm === 'eth_signMessage') {
        return await this.eth_signMessage(keyRef, data);
      } else if (
        ['eth_signTypedData', 'EthereumEip712Signature2021'].includes(algorithm)
      ) {
        return await this.eth_signTypedData(keyRef, data);
      }
    }

    throw Error(`not_supported: Cannot sign ${algorithm} `);
  }

  /**
   * @returns a `0x` prefixed hex string representing the signed EIP712 data
   */
  private async eth_signTypedData(keyRef: Pick<IKey, 'kid'>, data: Uint8Array) {
    let msg, msgDomain, msgTypes, msgPrimaryType;
    const serializedData = bytesToString(data);
    try {
      const jsonData = JSON.parse(serializedData);
      if (
        typeof jsonData.domain === 'object' &&
        typeof jsonData.types === 'object'
      ) {
        const { domain, types, message, primaryType } = jsonData;
        msg = message;
        msgDomain = domain;
        msgTypes = types;
        msgPrimaryType = primaryType;
      } else {
        // next check will throw since the data couldn't be parsed
      }
    } catch (e) {
      // next check will throw since the data couldn't be parsed
    }
    if (
      typeof msgDomain !== 'object' ||
      typeof msgTypes !== 'object' ||
      typeof msg !== 'object'
    ) {
      throw Error(
        `invalid_arguments: Cannot sign typed data. 'domain', 'types', and 'message' must be provided`
      );
    }
    delete msgTypes['EIP712Domain'];

    const { account, client } = this.getWalletClientByKeyRef(keyRef);
    return client.signTypedData({
      account,
      domain: msgDomain,
      types: msgTypes,
      primaryType: msgPrimaryType,
      message: msg,
    });
  }

  /**
   * @returns a `0x` prefixed hex string representing the signed message
   */
  private async eth_signMessage(
    keyRef: Pick<IKey, 'kid'>,
    rawMessageBytes: Uint8Array
  ) {
    const { account, client } = this.getWalletClientByKeyRef(keyRef);
    return client.signMessage({
      account,
      message: { raw: rawMessageBytes },
    });
  }
}
