import React from 'react';
import { CredentialData } from '../../../contexts/CredentialData';
import styles from './CredentialCard.module.scss';
import { Button } from '../../common/button';
// import { EthLogo } from '../../common/icons/ethLogo';

type Action = { label: string; handler: (actionLabel: string) => void };

interface CredentialCardProps {
  credentialView: CredentialData;
  actions: Action[];
}

export const CredentialCard: React.FC<CredentialCardProps> = ({
  credentialView: { type, description, fields },
  actions,
}) => {
  // value mapping
  const typeDisplay = type[0].toUpperCase() + type.slice(1).toLowerCase();
  // const logo = type === 'ethereum' ? <EthLogo /> : null;
  const shortenAddr = (addr?: string) =>
    addr ? addr.slice(0, 4) + '...' + addr.slice(-4) : undefined;

  return (
    <div data-testid={`credential-type-${type}`} className={styles.card}>
      <div className={styles.info}>
        <h3 className={styles.type}>{typeDisplay}</h3>
        {/* {logo && <div className={styles.logo}>{logo}</div>} */}
        {description && (
          <p className={styles.description} data-testid="credential-description">{description}</p>
        )}
        <div className={styles.idendity}>
          {type == 'ethereum' &&
            fields.map((field, index) => (
              <div key={index}>
                <div
                  data-testid={`field-key-${field.key}`}
                  className={styles.label}
                >
                  {field.key && field.key.split('-').slice(-1)}
                </div>
                <div
                  data-testid={`field-value-${field.key}`}
                  className={styles.value}
                >
                  {field.key == 'ethereum-account-address'
                    ? shortenAddr(field.value)
                    : field.value}
                </div>
              </div>
            ))}
        </div>
      </div>
      {actions.map((action, index) => (
        <Button
          key={index}
          onClick={() => action.handler(action.label)}
          data-testid={`credential-action-${action.label}`}
          text={action.label}
        />
      ))}
    </div>
  );
};

export type { CredentialCardProps };
