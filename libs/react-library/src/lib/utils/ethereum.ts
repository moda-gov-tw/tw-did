import {
  Chain,
  createPublicClient,
  createWalletClient,
  custom,
  http,
  WalletClient,
} from 'viem';
import { mainnet, goerli } from 'viem/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { createConfig } from 'wagmi';

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

export function getWalletClient(): WalletClient {
  const chain = getChain();

  const ethereum = window.ethereum;
  if (!ethereum) {
    throw new EthereumProviderNotExistError();
  }

  return createWalletClient({
    chain,
    transport: custom(ethereum),
  });
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
  } else if (mode === 'development' || mode === 'e2e' || mode === 'test') {
    return goerli;
  } else {
    throw new UnknownModeError(mode);
  }
}

export function getConfig() {
  const chain = getChain();
  const connector = new InjectedConnector();

  return createConfig({
    autoConnect: true,
    publicClient: createPublicClient({
      chain,
      transport: http(),
    }),
    connectors: [connector],
  });
}
