import React, { ReactNode, createContext, useContext } from 'react';
import * as ethereumCredential from './credentials/ethereum.json';
import { CredentialType, CredentialData } from './CredentialData';
import { useMessage } from '../hooks';
import { VerifiableCredential } from '@veramo/core';
import { MessageAction } from '@tw-did/core';

interface CredentialContextProps {
  credentials: CredentialData[];
  sendCredential: (action: MessageAction, credential?: CredentialData) => void;
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
  const credentials: CredentialData[] = [
    new CredentialData(CredentialType.ETHEREUM, ethereumCredential),
  ];
  const { postMessage } = useMessage<VerifiableCredential>();

  const sendCredential = (
    action: MessageAction,
    credential?: CredentialData
  ) => {
    postMessage(action, credential?.verifiableCredential);
  };

  return (
    <CredentialContext.Provider value={{ credentials, sendCredential }}>
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
