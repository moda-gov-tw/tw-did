import React from 'react';
import { CredentialCard } from './CredentialCard';
import { CredentialData } from '../../../contexts/CredentialData';
import styles from './CredentialCard.module.scss';

interface CredentialCardListProps {
  credentials: CredentialData[];
  actionLabels: string[];
  onAction: (index: number, actionLabel: string) => void;
}

export const CredentialCardList: React.FC<CredentialCardListProps> = ({
  credentials,
  actionLabels,
  onAction,
}) => {
  return (
    <div className={styles.list}>
      {credentials.map((credential, index) => {
        const actions = actionLabels.map((label) => ({
          label,
          handler: () => onAction(index, label),
        }));
        return (
          <CredentialCard
            key={index}
            credentialView={credential}
            actions={actions}
          />
        );
      })}
    </div>
  );
};
