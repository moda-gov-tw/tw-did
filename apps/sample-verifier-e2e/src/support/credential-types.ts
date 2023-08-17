export enum CredentialType {
  Ethereum = 'ethereum',
  Semaphore = 'semaphore',
}

export class UnsupportedCredentialTypeError extends Error {
  constructor(credentialType: string) {
    super(`Unsupported credential type: ${credentialType}`);
    this.name = 'UnsupportedCredentialTypeError';
  }
}

export function generateCredentialType() {
  return {
    name: 'credentialType',
    regexp: /(ethereum|semaphore)/,
    transformer: (credentialType: string) => {
      if (credentialType === CredentialType.Ethereum) {
        return CredentialType.Ethereum;
      } else if (credentialType === CredentialType.Semaphore) {
        return CredentialType.Semaphore;
      } else {
        throw new UnsupportedCredentialTypeError(credentialType);
      }
    },
  };
}
