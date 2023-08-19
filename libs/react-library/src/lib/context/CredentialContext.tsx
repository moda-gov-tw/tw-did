import React, { ReactNode, createContext, useContext } from 'react';
import { CredentialType, Credential } from '../types';

interface CredentialContextProps {
  credentials: Credential[];
}

const CredentialContext = createContext<CredentialContextProps | undefined>(
  undefined
);

export class CredentialContextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CredentialContextError';
  }
}

interface CredentialProviderProps {
  children: ReactNode;
}

export const CredentialProvider: React.FC<CredentialProviderProps> = ({
  children,
}) => {
  const credentials: Credential[] = [
    {
      type: CredentialType.ETHEREUM,
      fields: [],
    },
    {
      type: CredentialType.SEMAPHORE,
      fields: [],
    },
  ];

  return (
    <CredentialContext.Provider value={{ credentials }}>
      {children}
    </CredentialContext.Provider>
  );
};

export const useCredentials = () => {
  const context = useContext(CredentialContext);
  if (!context) {
    throw new CredentialContextError(
      'useCredentials must be used within a CredentialProvider'
    );
  }
  return context;
};
