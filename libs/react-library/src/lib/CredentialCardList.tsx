import React from 'react';
import { CredentialCard, CredentialView } from '..';

interface CredentialCardListProps {
  credentialViews: CredentialView[];
  actionLabels: string[];
  onAction: (index: number, actionLabel: string) => void;
}

export const CredentialCardList: React.FC<CredentialCardListProps> = ({
  credentialViews,
  actionLabels,
  onAction,
}) => {
  return (
    <div className="credential-view-list">
      {credentialViews.map((credential, index) => {
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
