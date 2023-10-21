export enum CredentialType {
  ETHEREUM = 'ethereum',
  SEMAPHORE = 'semaphore',
}

export enum CredentialFieldKey {
  NATION_ID = 'national-id',
  ETHEREUM_ADDRESS = 'ethereum-address',
}

export interface CredentialField {
  key: CredentialFieldKey;
  label?: string;
  value: string;
}

export enum ActionId {
  DOWNLOAD = 'download',
  GENERATE = 'generate',
  SELECT = 'select',
}

export interface CredentialAction {
  key: ActionId;
  label?: string;
}

export class CredentialViewData {
  type: CredentialType;
  description?: string;
  fields: CredentialField[];
  actions: CredentialAction[];

  constructor(
    type: CredentialType,
    fields: CredentialField[] = [],
    actions: CredentialAction[] = [],
    description?: string
  ) {
    this.type = type;
    this.fields = fields;
    this.description = description;
    this.actions = actions;
  }
}
