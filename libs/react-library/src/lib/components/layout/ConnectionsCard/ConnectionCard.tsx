import { useTranslation } from 'react-i18next';
import styles from './ConnectionCard.module.scss';
import { FidoLogo } from '../../common/icons/fidoLogo';
import { EthLogo } from '../../common/icons/ethLogo';
import { SuccessIcon } from '../../common/icons/success';
import { ErrorIcon } from '../../common/icons/error';
import { ShortenAddr } from '../../common/shortenAddr';

export const ConnectionCard = ({
  fidoState,
  walletState,
  bindState,
  walletAddr,
}: {
  fidoState?: number;
  walletState?: number;
  bindState?: number;
  nationID?: string;
  walletAddr?: string;
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={`${styles.ConnectionCard}  ${
        bindState !== undefined ? styles.bind : ''
      }`}
    >
      <div
        className={`${styles.service} ${
          fidoState !== undefined && fidoState === 0 ? styles.serviceNA : ''
        }`}
      >
        <FidoLogo />
        {fidoState !== undefined && fidoState === 2 && <SuccessIcon />}
        {fidoState !== undefined && fidoState === 3 && <ErrorIcon />}
      </div>

      {bindState !== undefined && bindState === 1 && <SuccessIcon />}
      {bindState !== undefined && bindState === 2 && <ErrorIcon />}

      <div
        className={`${styles.service} ${
          walletState !== undefined && walletState === 0 ? styles.serviceNA : ''
        }`}
      >
        <EthLogo />
        {walletState !== undefined && walletState === 2 && <SuccessIcon />}
        {walletState !== undefined && walletState === 3 && <ErrorIcon />}
        {walletAddr && (
          <div className={styles.info}>
            <div className={styles.label}>{t('walletAddress')}</div>
            <div className={styles.value}>
              <ShortenAddr addr={walletAddr} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
