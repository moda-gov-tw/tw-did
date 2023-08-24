import React from 'react';
import { CredentialCard, CredentialData } from '..';

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
    <div className="credential-view-list">
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
