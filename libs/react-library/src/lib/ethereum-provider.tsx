import React, { ReactNode, createContext } from 'react';
import { createPublicClient, http } from 'viem';
import { WagmiConfig, createConfig, mainnet } from 'wagmi';

const EthereumConfig = createContext(null);

interface EthereumProviderProps {
  children: ReactNode;
}

export const EthereumProvider: React.FC<EthereumProviderProps> = ({
  children,
}) => {
  const config = createConfig({
    autoConnect: true,
    publicClient: createPublicClient({
      chain: mainnet,
      transport: http(),
    }),
  });

  return (
    <EthereumConfig.Provider value={null}>
      <WagmiConfig config={config}>{children}</WagmiConfig>
    </EthereumConfig.Provider>
  );
};
