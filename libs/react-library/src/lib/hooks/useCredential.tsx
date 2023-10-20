import {
  CredentialViewData,
  CredentialType,
  CredentialFieldKey,
  CredentialAction,
  ActionId,
} from './CredentialData';

export interface CredentialMap {
  [CredentialType.SEMAPHORE]: CredentialViewData;
  [CredentialType.ETHEREUM]: CredentialViewData;
}

export enum CredentialMode {
  List,
  Select,
}

export function useCredentials(
  mode: CredentialMode,
  nationalId = '',
  ethereumAccount = ''
): CredentialMap {
  const actions: CredentialAction[] =
    mode === CredentialMode.List
      ? [{ key: ActionId.GENERATE, label: 'Generate' }]
      : [{ key: ActionId.SELECT, label: 'Select' }];
  return {
    [CredentialType.ETHEREUM]: {
      type: CredentialType.ETHEREUM,
      fields: [
        {
          key: CredentialFieldKey.NATION_ID,
          label: 'National ID',
          value: nationalId,
        },
        {
          key: CredentialFieldKey.ETHEREUM_ADDRESS,
          label: 'Account',
          value: ethereumAccount,
        },
      ],
      actions,
    },
    [CredentialType.SEMAPHORE]: {
      type: CredentialType.SEMAPHORE,
      description:
        'Verify your Taiwan resident status without revealing your true identity',
      actions,
      fields: [],
    },
  };
}
