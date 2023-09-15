import {
  Chain,
  createPublicClient,
  createWalletClient,
  custom,
  http,
  WalletClient,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet, goerli } from 'viem/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MockConnector } from 'wagmi/connectors/mock';
import { createConfig } from 'wagmi';

class MockPrivateKeyNotExistsError extends Error {
  constructor() {
    super(
      'Mock private key does not exist. ' +
        'Please set VITE_MOCK_WALLET_PRIVATE_KEY in .env file.'
    );

    this.name = 'MockPrivateKeyNotExistsError';
  }
}

class EthereumProviderNotExistError extends Error {
  constructor() {
    super('Ethereum Provider not exist');
    this.name = 'EthereumProviderNotExistError';
  }
}

class UnknownModeError extends Error {
  constructor(mode: string) {
    super(`Unknown mode: ${mode}`);
    this.name = 'UnknownModeError';
  }
}

class UnsupportChainError extends Error {
  constructor(chain: Chain) {
    super(`Unsupport chain: ${chain.name}`);
    this.name = 'UnsupportChainError';
  }
}

function getMockAccount() {
  const privateKey = import.meta.env.VITE_MOCK_WALLET_PRIVATE_KEY;
  if (!privateKey) {
    throw new MockPrivateKeyNotExistsError();
  }

  return privateKeyToAccount(privateKey);
}

function getMockConnector(chain: Chain) {
  const walletClient = createWalletClient({
    account: getMockAccount(),
    chain,
    transport: http(),
  });

  const mockOptions = {
    chainId: chain.id,
    walletClient,
    flags: { isAuthorized: true },
  };

  return new MockConnector({ options: mockOptions });
}

export function getWalletClient(): WalletClient {
  const chain = getChain();

  if (import.meta.env.MODE === 'e2e') {
    const customRpc = http() as any;
    const account = getMockAccount();

    return createWalletClient({
      account,
      chain,
      transport: custom({
        async request({ method, params }) {
          if (method === 'eth_signTypedData_v4') {
            return account.signTypedData(JSON.parse(params[1]));
          } else {
            return customRpc.request(method, params);
          }
        },
      }),
    });
  } else {
    const ethereum = window.ethereum;
    if (!ethereum) {
      throw new EthereumProviderNotExistError();
    }

    return createWalletClient({
      chain,
      transport: custom(ethereum),
    });
  }
}

export function getNetworkName(chain: Chain) {
  if (chain.id === mainnet.id) {
    return 'mainnet';
  } else if (chain.id === goerli.id) {
    return 'goerli';
  } else {
    throw new UnsupportChainError(chain);
  }
}

export function getChain() {
  const mode = import.meta.env.MODE;
  if (mode === 'production') {
    return mainnet;
  } else if (mode === 'development' || mode === 'e2e') {
    return goerli;
  } else {
    throw new UnknownModeError(mode);
  }
}

export function getConfig() {
  const chain = getChain();

  const connector =
    import.meta.env.MODE === 'e2e'
      ? getMockConnector(chain)
      : new InjectedConnector();

  return createConfig({
    autoConnect: true,
    publicClient: createPublicClient({
      chain,
      transport: http(),
    }),
    connectors: [connector],
  });
}
