import { VerifiableCredential } from '@veramo/core';
import {
  EthereumLoginDto,
  EthereumLoginResponseDto,
  MessageAction,
  NonceDto,
  RevocationResponseDto,
} from '.';

export class InvalidOriginError extends Error {
  constructor(origin: string) {
    super(`Invalid origin: Received message from untrusted origin ${origin}`);
    this.name = 'InvalidOriginError';
  }
}

class EthereumLoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EthereumLoginError';
    Object.setPrototypeOf(this, EthereumLoginError.prototype);
  }
}

class RevocationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RevocationError';
    Object.setPrototypeOf(this, RevocationError.prototype);
  }
}

export type SelectCredentialMessage = {
  action: MessageAction;
  payload?: VerifiableCredential;
};

export class TwDidService {
  host: string;
  token?: string;

  constructor(host: string, token?: string) {
    this.host = host;
    this.token = token;
  }

  async ethereumChallenge(): Promise<NonceDto> {
    const challengeRes = await fetch(
      `${this.host}/api/auth/ethereum/challenge`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );

    const challengeData: NonceDto = await challengeRes.json();
    if (challengeRes.status !== 201) {
      throw new EthereumLoginError('Failed to get Ethereum challenge');
    }

    return challengeData;
  }

  async ethereumLogin(
    loginDto: EthereumLoginDto
  ): Promise<EthereumLoginResponseDto> {
    const loginRes = await fetch(`${this.host}/api/auth/ethereum/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(loginDto),
    });

    if (loginRes.status === 201) {
      const response: EthereumLoginResponseDto = await loginRes.json();
      return response;
    } else {
      throw new EthereumLoginError('Ethereum login failed');
    }
  }

  async revoke(): Promise<RevocationResponseDto> {
    const res = await fetch(`${this.host}/api/users/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (res.status === 201) {
      const response: RevocationResponseDto = await res.json();
      return response;
    } else {
      throw new RevocationError('revocation failed');
    }
  }

  selectCredential(win: Window): Promise<SelectCredentialMessage> {
    const childWindow = win.open(`${this.host}/select-credential`, '_blank');

    return new Promise<SelectCredentialMessage>((resolve) => {
      const handler = (event: MessageEvent) => {
        if (event.origin !== this.host) return;

        win.removeEventListener('message', handler);
        resolve(event.data as SelectCredentialMessage);
        return childWindow?.close();
      };

      win.addEventListener('message', handler, false);
    });
  }
}
