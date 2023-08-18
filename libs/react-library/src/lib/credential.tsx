import React from 'react';

type CredentialType = 'ethereum' | 'semaphore';
type Action = { label: string; handler: () => void };

interface Field {
  key: string;
  value: string;
}

interface CredentialProps {
  type: CredentialType;
  description?: string;
  fields: Field[];
  actions: Action[];
}

const Credential: React.FC<CredentialProps> = ({
  type,
  description,
  fields,
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
          onClick={action.handler}
          data-testid={`credential-action-${action.label}`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default Credential;
export type { CredentialType, CredentialProps, Field };
