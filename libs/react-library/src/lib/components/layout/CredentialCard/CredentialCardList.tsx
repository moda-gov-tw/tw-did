import React from 'react';
import { CredentialCard } from './CredentialCard';
import styles from './CredentialCard.module.scss';
import {
  CredentialMap,
  CredentialViewData,
  CredentialType,
  ActionId,
} from '../../../hooks';

interface CredentialCardListProps {
  credentials: CredentialMap;
  onAction: (credentialKey: CredentialType, actionId: ActionId) => void;
}

export const CredentialCardList: React.FC<CredentialCardListProps> = ({
  credentials,
  onAction,
}) => {
  return (
    <div className={styles.list}>
      {Object.values(credentials).map(
        (credential: CredentialViewData, index: number) => {
          return (
            <CredentialCard
              key={index}
              credentialView={credential}
              onAction={onAction}
            />
          );
        }
      )}
    </div>
  );
};
