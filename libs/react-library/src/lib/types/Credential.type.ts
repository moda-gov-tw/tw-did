import { CredentialField, CredentialType } from '.';

export interface Credential {
  type: CredentialType;
  description?: string;
  fields: CredentialField[];
}
