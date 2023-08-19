import React from 'react';
import { Credential } from './types';
import { CredentialCard } from '..';

interface CredentialCardListProps {
  credentials: Credential[];
  actionLabels: string[];
  onAction: (index: number, actionLabel: string) => void;
}

export const CredentialCardList: React.FC<CredentialCardListProps> = ({
  credentials,
  actionLabels,
  onAction,
}) => {
  return (
    <div className="credential-view-list">
      {credentials.map((credential, index) => {
        const actions = actionLabels.map((label) => ({
          label,
          handler: () => onAction(index, label),
        }));
        return (
          <CredentialCard
            key={index}
            credential={credential}
            actions={actions}
          />
        );
      })}
    </div>
  );
};
