import React from 'react';
import { CredentialType, Credential } from './types';

type Action = { label: string; handler: (actionLabel: string) => void };

interface CredentialCardProps {
  credential: Credential;
  actions: Action[];
}

export const CredentialCard: React.FC<CredentialCardProps> = ({
  credential: { type, description, fields },
  actions,
}) => {
  return (
    <div data-testid={`credential-type-${type}`} className="credential">
      <h3>Type: {type}</h3>
      {description && <p data-testid="credential-description">{description}</p>}
      <ul>
        {fields.map((field, index) => (
          <li key={index}>
            <span data-testid={`field-key-${field.key}`}>{field.key}</span>:{' '}
            <span data-testid={`field-value-${field.key}`}>{field.value}</span>
          </li>
        ))}
      </ul>
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => action.handler(action.label)}
          data-testid={`credential-action-${action.label}`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};

export type { CredentialType, CredentialCardProps };
