import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { EIP1193Provider, getAddress } from 'viem';
import { SiweMessage } from 'siwe';
import {
  VerifiableCredential,
  IIdentifier,
  CredentialPayload,
} from '@veramo/core-types';
import { Group } from '@semaphore-protocol/group';
import {
  CommitmentsDto,
  MessageAction,
  SEMAPHORE_CONTEXT_URI,
  SEMAPHORE_DID_ALIAS,
  SEMAPHORE_GROUP_DEPTH,
  SEMAPHORE_GROUP_ID,
  SEMAPHORE_HIDDEN_DID,
  SEMAPHORE_HIDDEN_PUBLIC_KEY,
  SEMAPHORE_TYPE,
  TwDidService,
} from '@tw-did/core';
import { signMessage } from '@wagmi/core';
import { Identity } from '@semaphore-protocol/identity';
import { SEMAPHORE_KMS, WEB_DID_PROVIDER, getAgent } from './veramo';
import { useMessage } from '../hooks';
import { EthereumLoginDto } from '@tw-did/core';

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
  }
}
class FetchUserDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FetchUserDataError';
    Object.setPrototypeOf(this, FetchUserDataError.prototype);
  }
}

class LoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LoginError';
    Object.setPrototypeOf(this, LoginError.prototype);
  }
}

class NoTwDidProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoAuthProviderError';
    Object.setPrototypeOf(this, NoTwDidProviderError.prototype);
  }
}

class UpdateSemaphoreCommitmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UpdateSemaphoreCommitmentError';
    Object.setPrototypeOf(this, UpdateSemaphoreCommitmentError.prototype);
  }
}

interface User {
  nationalId: string;
  ethereumAccount: string;
  semaphoreCommitment: string;
  id: string;
  token: string;
}

interface RequestLoginResponse {
  transactionId: string;
  spTicketId: string;
  spTicketPayload: string;
}

interface LoginMetadata {
  transactionId: string;
  spTicketId: string;
}

interface QrcodeLoginMetadata extends LoginMetadata {
  spTicketPayload: string;
}

export interface LoginInfo {
  nationalId: string;
  notification: LoginMetadata;
  qrcode: QrcodeLoginMetadata;
}

interface TwDidContextProps {
  user: User | null;
  loginInfo: LoginInfo | null;
  requestLogin: (nationalId: string) => Promise<void>;
  logout: () => void;
  ethereumLogin: () => Promise<void>;
  getEthereumVerifiableCredential: () => Promise<VerifiableCredential>;
  generateSemaphoreVerifiableCredential: (
    identity: Identity,
    group: Group
  ) => Promise<VerifiableCredential>;
  getSemaphoreGroup: () => Promise<Group>;
  updateSemaphoreCommitment: (semaphoreCommitment: string) => Promise<void>;
  generateSemaphoreIdentity: () => Promise<Identity>;
  sendCredential: (action: MessageAction, vc: VerifiableCredential) => void;
}

interface TwDidProviderProps {
  children: ReactNode;
}

const TwDidContext = createContext<TwDidContextProps | undefined>(undefined);

export const TwDidProvider: React.FC<TwDidProviderProps> = ({ children }) => {
  const { postMessage } = useMessage<VerifiableCredential>();
  const [user, setUser] = useState<User | null>(null);
  const [loginInfo, setLoginInfo] = useState<LoginInfo | null>(null);
  const urlPrefix =
    import.meta.env.MODE === 'development' ? 'http://localhost:3000' : '';
  const twDidService = new TwDidService(urlPrefix, user?.token);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const { id, token } = JSON.parse(storedUser);
      setUserInfo(id, token).catch((err) => console.error(err));
    }
  }, []);

  const setUserInfo = async (id: string, token: string) => {
    const res = await fetch(`${urlPrefix}/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await res.json();
    if (res.status === 200) {
      const { nationalId, currentIdentity } = user;
      const { ethereumAccount, semaphoreCommitment } = currentIdentity || {};
      setUser({
        nationalId,
        ethereumAccount,
        semaphoreCommitment,
        id,
        token,
      });
      localStorage.setItem('user', JSON.stringify({ id, token }));

      return user;
    } else {
      throw new FetchUserDataError('Fetch user data failed');
    }
  };

  const _requestLogin = async (
    nationalId: string,
    method: 'QRCODE' | 'NOTIFY'
  ): Promise<RequestLoginResponse> => {
    const requestRes = await fetch(
      `${urlPrefix}/api/auth/national/request-login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalId, method }),
      }
    );

    const res: RequestLoginResponse = await requestRes.json();
    return res;
  };

  const _login = async (
    nationalId: string,
    transactionId: string,
    spTicketId: string
  ) => {
    const loginDto = {
      nationalId,
      transactionId,
      spTicketId,
    };

    const loginRes = await fetch(`${urlPrefix}/api/auth/national/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginDto),
    });

    const data = await loginRes.json();

    if (loginRes.status === 201) {
      await setUserInfo(data.id, data.token);
    } else {
      throw new LoginError('Login failed');
    }
  };

  const requestLogin = async (nationalId: string) => {
    const notifyRes = await _requestLogin(nationalId, 'NOTIFY');
    const qrcodeRes = await _requestLogin(nationalId, 'QRCODE');

    const notification = {
      transactionId: notifyRes.transactionId,
      spTicketId: notifyRes.spTicketId,
    };
    const qrcode = {
      transactionId: qrcodeRes.transactionId,
      spTicketId: qrcodeRes.spTicketId,
      spTicketPayload: qrcodeRes.spTicketPayload,
    };

    const info: LoginInfo = {
      nationalId,
      notification,
      qrcode,
    };

    setLoginInfo(info);

    // qrcode login
    _login(nationalId, qrcode.transactionId, qrcode.spTicketId);
    // notification login
    _login(nationalId, notification.transactionId, notification.spTicketId);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const ethereumLogin = async (): Promise<void> => {
    if (!user) {
      throw new NoTwDidProviderError(
        'User must be authenticated for Ethereum login'
      );
    }

    const nonceDto = await twDidService.ethereumChallenge();
    const nonce = nonceDto.value;

    if (window.ethereum) {
      const [account] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const address = getAddress(account);
      const rawMessage = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: 1,
        nonce,
      });

      const message = rawMessage.prepareMessage() as `0x${string}`;
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });

      const id = user.id;
      const loginDto: EthereumLoginDto = { message, signature, account, id };

      const res = await twDidService.ethereumLogin(loginDto);
      if (res.address === address) {
        await setUserInfo(user.id, user.token);
      }
    }
  };

  const updateSemaphoreCommitment = async (commitment: string) => {
    if (!user || !user.id) {
      throw new NoTwDidProviderError(
        'User must be authenticated to update Semaphore commitment'
      );
    }

    const res = await fetch(`${urlPrefix}/api/auth/semaphore`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ id: user.id, commitment }),
    });

    if (res.status === 200) {
      await setUserInfo(user.id, user.token);
    } else {
      throw new UpdateSemaphoreCommitmentError(
        'Failed to update Semaphore commitment'
      );
    }
  };

  const getEthereumVerifiableCredential = async () => {
    const res: VerifiableCredential = await fetch(
      `${urlPrefix}/api/users/credential`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${user?.token}` },
      }
    ).then((res) => res.json());

    return res;
  };

  const getSemaphoreGroup = async (): Promise<Group> => {
    const commitments: CommitmentsDto = await fetch(
      `${urlPrefix}/api/users/commitments`
    ).then((res) => res.json());
    return new Group(
      SEMAPHORE_GROUP_ID,
      SEMAPHORE_GROUP_DEPTH,
      commitments.activated
    );
  };

  const generateSemaphoreIdentity = async () => {
    const message = `Sign this message to generate your Semaphore identity.`;
    const result = await signMessage({ message });
    return new Identity(result);
  };

  const generateSemaphoreVerifiableCredential = async (
    identity: Identity,
    group: Group
  ) => {
    const alias = SEMAPHORE_DID_ALIAS;
    const did = SEMAPHORE_HIDDEN_DID;
    const provider = WEB_DID_PROVIDER;
    const kms = SEMAPHORE_KMS;
    const type = SEMAPHORE_TYPE;
    const privateKeyHex = identity.toString();
    const publicKeyHex = SEMAPHORE_HIDDEN_PUBLIC_KEY;
    const kid = 'default';
    const proofFormat = 'lds';

    const agent = await getAgent();
    let holder: IIdentifier;

    try {
      holder = await agent.didManagerGetByAlias({ alias });
    } catch (e) {
      holder = await agent.didManagerImport({
        did,
        provider,
        keys: [{ kid, kms, type, privateKeyHex, publicKeyHex }],
      });
    }

    const credential: CredentialPayload = {
      '@context': [SEMAPHORE_CONTEXT_URI],
      issuer: holder.did,
      credentialSubject: {
        groupId: group.id,
        depth: group.depth,
        members: group.members.map((m) => m.toString()),
      },
    };

    return agent.createVerifiableCredential({
      credential,
      proofFormat,
    });
  };

  const sendCredential = async (
    action: MessageAction,
    vc: VerifiableCredential
  ) => {
    postMessage(action, vc);
  };

  return (
    <TwDidContext.Provider
      value={{
        user,
        loginInfo,
        requestLogin,
        logout,
        ethereumLogin,
        updateSemaphoreCommitment,
        getEthereumVerifiableCredential,
        getSemaphoreGroup,
        generateSemaphoreIdentity,
        generateSemaphoreVerifiableCredential,
        sendCredential,
      }}
    >
      {children}
    </TwDidContext.Provider>
  );
};

export const useTwDid = (): TwDidContextProps => {
  const context = useContext(TwDidContext);
  if (!context) {
    throw new NoTwDidProviderError(
      'No TwDidProvider found in the component tree.'
    );
  }
  return context;
};
