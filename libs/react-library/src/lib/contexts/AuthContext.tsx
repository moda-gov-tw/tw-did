import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

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

class RegisterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RegisterError';
    Object.setPrototypeOf(this, RegisterError.prototype);
  }
}

class NoAuthProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoAuthProviderError';
    Object.setPrototypeOf(this, NoAuthProviderError.prototype);
  }
}

interface User {
  nationalId: string;
  ethereumAccount: string;
  id: string;
  token: string;
}

interface AuthContextProps {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
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
      const { nationalId, ethereumAccount } = data;
      setUser({
        nationalId,
        ethereumAccount,
        id,
        token,
      });
      localStorage.setItem('user', JSON.stringify({ id, token }));
    } else {
      throw new FetchUserDataError('Fetch user data failed');
    }
  };

  const login = async (username: string, password: string) => {
    const res = await fetch('/api/auth/national/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.status === 200) {
      await setUserInfo(data.id, data.token);
    } else {
      throw new LoginError('Login failed');
    }
  };

  const register = async (username: string, password: string) => {
    const res = await fetch('/api/auth/national/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.status === 201) {
      await setUserInfo(data.id, data.token);
    } else {
      throw new RegisterError('Registration failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register }}>
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
