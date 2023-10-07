import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { EIP1193Provider, getAddress } from 'viem';
import { SiweMessage } from 'siwe';

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

class NoAuthProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoAuthProviderError';
    Object.setPrototypeOf(this, NoAuthProviderError.prototype);
  }
}

class EthereumLoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EthereumLoginError';
    Object.setPrototypeOf(this, EthereumLoginError.prototype);
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

interface AuthContextProps {
  user: User | null;
  requestLogin: (
    nationalId: string,
    method: 'QRCODE' | 'NOTIFY'
  ) => Promise<RequestLoginResponse>;
  login: (
    nationalId: string,
    transactionId: string,
    spTicketId: string
  ) => Promise<void>;
  logout: () => void;
  ethereumLogin: () => Promise<void>;
  updateSemaphoreCommitment: (semaphoreCommitment: string) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const { id, token } = JSON.parse(storedUser);
      setUserInfo(id, token).catch((err) => console.error(err));
    }
  }, []);

  const setUserInfo = async (id: string, token: string) => {
    const res = await fetch(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.status === 200) {
      const { nationalId, ethereumAccount, semaphoreCommitment } = data;
      setUser({
        nationalId,
        ethereumAccount,
        semaphoreCommitment,
        id,
        token,
      });
      localStorage.setItem('user', JSON.stringify({ id, token }));
    } else {
      throw new FetchUserDataError('Fetch user data failed');
    }
  };

  const requestLogin = async (
    nationalId: string,
    method: 'QRCODE' | 'NOTIFY'
  ):Promise<RequestLoginResponse> => {
    const requestRes = await fetch('/api/auth/national/request-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nationalId, method }),
    });

    const res: RequestLoginResponse = await requestRes.json();
    return res;
  };

  const login = async (
    nationalId: string,
    transactionId: string,
    spTicketId: string
  ) => {
    const loginDto = {
      nationalId,
      transactionId,
      spTicketId,
    };

    const loginRes = await fetch('/api/auth/national/login', {
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const ethereumLogin = async (): Promise<void> => {
    if (!user) {
      throw new NoAuthProviderError(
        'User must be authenticated for Ethereum login'
      );
    }

    const challengeRes = await fetch('/api/auth/ethereum/challenge', {
      method: 'POST',
      headers: { Authorization: `Bearer ${user.token}` },
    });

    const challengeData = await challengeRes.json();
    if (challengeRes.status !== 201) {
      throw new EthereumLoginError('Failed to get Ethereum challenge');
    }

    const nonce = challengeData.value;

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
      console.log('signature', signature);
      console.log('message', rawMessage);

      const id = user.id;
      const loginRes = await fetch('/api/auth/ethereum/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ message, signature, account, id }),
      });

      if (loginRes.status === 201) {
        await setUserInfo(user.id, user.token);
      } else {
        throw new EthereumLoginError('Ethereum login failed');
      }
    }
  };

  const updateSemaphoreCommitment = async (commitment: string) => {
    if (!user || !user.id) {
      throw new NoAuthProviderError(
        'User must be authenticated to update Semaphore commitment'
      );
    }

    const res = await fetch('/api/auth/semaphore', {
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

  return (
    <AuthContext.Provider
      value={{
        user,
        requestLogin,
        login,
        logout,
        ethereumLogin,
        updateSemaphoreCommitment,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new NoAuthProviderError(
      'No AuthProvider found in the component tree.'
    );
  }
  return context;
};
