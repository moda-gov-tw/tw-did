import React from 'react';
import {
  ActionId,
  CredentialFieldKey,
  CredentialType,
  CredentialViewData,
} from '../../../hooks';
import styles from './CredentialCard.module.scss';
import { Button } from '../../common/button';
import { ShortenAddr, ShortenId } from '../../common/shortenAddr';

interface CredentialCardProps {
  credentialView: CredentialViewData;
  onAction: (type: CredentialType, actionId: ActionId) => void;
}

export const CredentialCard: React.FC<CredentialCardProps> = ({
  credentialView: { type, description, fields, actions },
  onAction,
}) => {
  function renderFieldValue(key: CredentialFieldKey, value: string) {
    if (key === CredentialFieldKey.ETHEREUM_ADDRESS) {
      return <ShortenAddr addr={value} />;
    } else if (key === CredentialFieldKey.NATION_ID) {
      return <ShortenId id={value} />;
    } else {
      return value;
    }
  }

  return (
    <div data-testid={`credential-type-${type}`} className={styles.card}>
      <div className={styles.info}>
        <h3 className={styles.type}>{type}</h3>
        {description && (
          <p
            className={styles.description}
            data-testid="credential-description"
          >
            {description}
          </p>
        )}
        <div className={styles.idendity}>
          {type === CredentialType.ETHEREUM &&
            fields.map((field, index) => (
              <div key={index}>
                <div
                  data-testid={`field-key-${field.key}`}
                  className={styles.label}
                >
                  {field.label || field.label}
                </div>
                <div
                  data-testid={`field-value-${field.key}`}
                  className={styles.value}
                >
                  {renderFieldValue(field.key, field.value)}
                </div>
              </div>
            ))}
        </div>
      </div>
      {actions.map((action, index) => (
        <Button
          key={index}
          onClick={() => onAction(type, action.key)}
          data-testid={`credential-action-${action.label}`}
          text={action.label}
        />
      ))}
    </div>
  );
};

export type { CredentialCardProps };
