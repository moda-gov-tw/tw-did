import { TwDidProvider, getConfig } from '@tw-did/react-library';
import React, { ReactNode, createContext } from 'react';
import { WagmiConfig } from 'wagmi';

const ApplicationConfig = createContext(null);

interface ApplicationContextProps {
  children: ReactNode;
}

export const ApplicationContext: React.FC<ApplicationContextProps> = ({
  children,
}) => {
  return (
    <ApplicationConfig.Provider value={null}>
      <WagmiConfig config={getConfig()}>
        <TwDidProvider>{children}</TwDidProvider>
      </WagmiConfig>
    </ApplicationConfig.Provider>
  );
};
