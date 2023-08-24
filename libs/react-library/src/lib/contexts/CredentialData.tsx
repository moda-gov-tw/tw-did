import { VerifiableCredential } from '@veramo/core';

export enum CredentialType {
  ETHEREUM = 'ethereum',
  SEMAPHORE = 'semaphore',
}

export interface CredentialField {
  key: string;
  value: string;
}

export class CredentialData {
  type: CredentialType;
  description?: string;
  fields: CredentialField[];
  verifiableCredential?: VerifiableCredential;

  constructor(
    type: CredentialType,
    vc?: VerifiableCredential,
    fields: CredentialField[] = [],
    description?: string
  ) {
    this.type = type;
    this.verifiableCredential = vc;
    this.fields = fields;
    this.description = description;

    if (fields.length === 0 && vc) {
      Object.keys(vc.credentialSubject).forEach((key) => {
        this.fields.push({
          key,
          value: vc.credentialSubject[key],
        });
      });
    }
  }
}
