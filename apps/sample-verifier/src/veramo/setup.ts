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
import {
  VeramoLdSignature,
  CredentialIssuerLD,
  LdDefaultContexts,
} from '@veramo/credential-ld';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import { WebDIDProvider } from '@veramo/did-provider-web';
import { KeyManager, MemoryPrivateKeyStore } from '@veramo/key-manager';
import { KeyStoreJson } from '@veramo/data-store-json';
import { CredentialPlugin } from '@veramo/credential-w3c';
import { DIDManager, MemoryDIDStore } from '@veramo/did-manager';
import { getResolver as getEthrResolver } from 'ethr-did-resolver';
import { getResolver as getWebResolver } from 'web-did-resolver';
import {
  SEMAPHORE_EXTRA_CONTEXTS,
  SemaphoreKeyManagementSystem,
  SemaphoreSignature2023,
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
export const ETHR_DID_PROVIDER = `did:ethr:${ETHEREUM_NETWORK}`;
export const WEB_DID_PROVIDER = 'did:web';
export const DID_CLIENT_NAME = 'metamask';
export const WEB3_KMS = 'web3';
export const SEMAPHORE_KMS = 'semaphore';

export async function getAgent(): Promise<TAgent<InstalledPlugins>> {
  if (import.meta.env.VITE_INFURA_PROJECT_ID === undefined) {
    throw new InfuraProjectIdNotExistError();
  }

  const suites: VeramoLdSignature[] = [new SemaphoreSignature2023()];
  const memoryJsonStore = {
    notifyUpdate: () => Promise.resolve(),
  };
  const infuraProjectId = import.meta.env.VITE_INFURA_PROJECT_ID;
  const wallet = getWalletClient();
  const contextMaps = [LdDefaultContexts, SEMAPHORE_EXTRA_CONTEXTS];

  return createAgent<InstalledPlugins>({
    plugins: [
      new KeyManager({
        store: new KeyStoreJson(memoryJsonStore),
        kms: {
          [WEB3_KMS]: new WalletClientKeyManagementSystem({
            [DID_CLIENT_NAME]: wallet,
          }),
          [SEMAPHORE_KMS]: new SemaphoreKeyManagementSystem(
            new MemoryPrivateKeyStore()
          ),
        },
      }),
      new DIDManager({
        store: new MemoryDIDStore(),
        defaultProvider: ETHR_DID_PROVIDER,
        providers: {
          [ETHR_DID_PROVIDER]: new EthrDIDProvider({
            defaultKms: WEB3_KMS,
            network: ETHEREUM_NETWORK,
            rpcUrl: `https://${ETHEREUM_NETWORK}.infura.io/v3/${infuraProjectId}`,
          }),
          [WEB_DID_PROVIDER]: new WebDIDProvider({
            defaultKms: SEMAPHORE_KMS,
          }),
        },
      }),
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...getEthrResolver({ infuraProjectId }),
          ...getWebResolver(),
        }),
      }),
      new CredentialPlugin(),
      new CredentialIssuerLD({ suites, contextMaps }),
      new TwDidCredentialIssuerEIP712(),
    ],
  });
}
