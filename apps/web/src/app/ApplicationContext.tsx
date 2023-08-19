import React, { ReactNode, createContext } from 'react';
import { createPublicClient, http } from 'viem';
import { WagmiConfig, createConfig, mainnet } from 'wagmi';

const ApplicationConfig = createContext(null);

interface ApplicationContextProps {
  children: ReactNode;
}

export const ApplicationContext: React.FC<ApplicationContextProps> = ({
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
    <ApplicationConfig.Provider value={null}>
      <WagmiConfig config={config}>{children}</WagmiConfig>
    </ApplicationConfig.Provider>
  );
};
