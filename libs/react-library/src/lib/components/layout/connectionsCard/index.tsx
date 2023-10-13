import styles from './connectionCard.module.scss';
import { FidoLogo } from '../../common/icons/fidoLogo';
import { EthLogo } from '../../common/icons/ethLogo';
import { SuccessIcon } from '../../common/icons/success';
import { ErrorIcon } from '../../common/icons/error';
import { ShortenAddr } from '../../common/shortenAddr';
import { maskString } from '../../../utils/utils';

export const ConnectionCard = ({
  fidoState,
  walletState,
  bindState,
  nationID,
  walletAddr,
}: {
  fidoState?: number;
  walletState?: number;
  bindState?: number;
  nationID?: string;
  walletAddr?: string;
}) => (
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
      {nationID && (
        <div className={styles.info}>
          <div className={styles.label}>Nation ID</div>
          <div className={styles.value}>{maskString(nationID)}</div>
        </div>
      )}
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
          <div className={styles.label}>Wallet Addr</div>
          <div className={styles.value}>
            <ShortenAddr addr={walletAddr} />
          </div>
        </div>
      )}
    </div>
  </div>
);
