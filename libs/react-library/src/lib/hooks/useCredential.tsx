import { useTranslation } from 'react-i18next';
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
  hashedNationalId = '',
  ethereumAccount = ''
): CredentialMap {
  const { t } = useTranslation();
  const actions: CredentialAction[] =
    mode === CredentialMode.List
      ? [{ key: ActionId.GENERATE, label: t('generate') }]
      : [{ key: ActionId.SELECT, label: t('select') }];
  return {
    [CredentialType.ETHEREUM]: {
      type: CredentialType.ETHEREUM,
      fields: [
        {
          key: CredentialFieldKey.ETHEREUM_ADDRESS,
          label: t('account'),
          value: ethereumAccount,
        },
      ],
      actions,
    },
    [CredentialType.SEMAPHORE]: {
      type: CredentialType.SEMAPHORE,
      description: t('verifyTaiwanResidentStatus'),
      actions,
      fields: [],
    },
  };
}
