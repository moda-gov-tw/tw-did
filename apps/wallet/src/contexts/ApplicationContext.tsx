import { TwDidProvider, getConfig } from '@tw-did/react-library';
import React, { ReactNode, createContext } from 'react';
import { createPublicClient, http } from 'viem';
import { WagmiConfig, createConfig, mainnet } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

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
    connectors: [new InjectedConnector()],
  });

  return (
    <ApplicationConfig.Provider value={null}>
      <WagmiConfig config={config}>
        <TwDidProvider>{children}</TwDidProvider>
      </WagmiConfig>
    </ApplicationConfig.Provider>
  );
};
