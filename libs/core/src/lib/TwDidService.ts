import { VerifiableCredential } from '@veramo/core';
import { GroupInfo, MessageAction } from '.';

export class InvalidOriginError extends Error {
  constructor(origin: string) {
    super(`Invalid origin: Received message from untrusted origin ${origin}`);
    this.name = 'InvalidOriginError';
  }
}

export type SelectCredentialMessage = {
  action: MessageAction;
  payload?: VerifiableCredential;
};

export class TwDidService {
  host: string;
  constructor(host: string) {
    this.host = host;
  }

  selectCredential(): Promise<SelectCredentialMessage> {
    const childWindow = window.open(`${this.host}/select-credential`, '_blank');

    return new Promise<SelectCredentialMessage>((resolve) => {
      const handler = (event: MessageEvent) => {
        if (event.origin !== this.host) return;

        window.removeEventListener('message', handler);
        resolve(event.data as SelectCredentialMessage);
        return childWindow?.close();
      };

      window.addEventListener('message', handler, false);
    });
  }

  // TODO: this is a mock implementation
  fetchGroupInfo(groupId: string): Promise<GroupInfo> {
    return Promise.resolve({
      id: groupId,
      depth: 20,
      members: [
        '18247677939749764709615722514754949329375911953462583983649646599131197861128',
      ],
    });
  }
}
