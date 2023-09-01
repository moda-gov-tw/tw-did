import {
  createAgent,
  ICredentialPlugin,
  IDIDManager,
  IResolver,
  TAgent,
} from '@veramo/core';
import { ICredentialIssuerEIP712 } from '@veramo/credential-eip712';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import { Resolver } from 'did-resolver';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import { KeyManager } from '@veramo/key-manager';
import { KeyStoreJson } from '@veramo/data-store-json';
import { CredentialPlugin } from '@veramo/credential-w3c';
import { DIDManager, MemoryDIDStore } from '@veramo/did-manager';
import { createWalletClient, custom } from 'viem';
import { getResolver } from 'ethr-did-resolver';
import {
  TwDidCredentialIssuerEIP712,
  WalletClientKeyManagementSystem,
} from '@tw-did/core';
import { getChain, getNetworkName, getWalletClient } from '../config';

/**
 * the error for Infura Project id not exist
 */
class InfuraProjectIdNotExistError extends Error {
  constructor() {
    super('Infura Project id not exist');
    this.name = 'InfuraProjectIdNotExistError';
  }
}

type InstalledPlugins = IResolver &
  IDIDManager &
  ICredentialPlugin &
  ICredentialIssuerEIP712;

export const ETHEREUM_NETWORK = getNetworkName(getChain());
export const DID_PROVIDER = `did:ethr:${ETHEREUM_NETWORK}`;
export const DID_KMS = 'web3';
export const DID_CLIENT_NAME = 'metamask';

export async function getAgent(): Promise<TAgent<InstalledPlugins>> {
  if (import.meta.env.VITE_INFURA_PROJECT_ID === undefined) {
    throw new InfuraProjectIdNotExistError();
  }

  const memoryJsonStore = {
    notifyUpdate: () => Promise.resolve(),
  };
  const infuraProjectId = import.meta.env.VITE_INFURA_PROJECT_ID;
  const wallet = getWalletClient();

  return createAgent<InstalledPlugins>({
    plugins: [
      new KeyManager({
        store: new KeyStoreJson(memoryJsonStore),
        kms: {
          [DID_KMS]: new WalletClientKeyManagementSystem({
            [DID_CLIENT_NAME]: wallet,
          }),
        },
      }),
      new DIDManager({
        store: new MemoryDIDStore(),
        defaultProvider: DID_PROVIDER,
        providers: {
          [DID_PROVIDER]: new EthrDIDProvider({
            defaultKms: DID_KMS,
            network: ETHEREUM_NETWORK,
            rpcUrl: `https://${ETHEREUM_NETWORK}.infura.io/v3/${infuraProjectId}`,
          }),
        },
      }),
      new DIDResolverPlugin({
        resolver: new Resolver(getResolver({ infuraProjectId })),
      }),
      new CredentialPlugin(),
      new TwDidCredentialIssuerEIP712(),
    ],
  });
}
