import styles from './connectionCardSimple.module.scss';
import { ShortenAddr } from '../../common/shortenAddr';

export const ConnectionCardSimple = ({
  nationID,
  walletAddr,
}: {
  nationID: string;
  walletAddr: string;
}) => (
  <div className={styles.ConnectionCardSimple}>
    <div className={styles.info}>
      <div className={styles.label}>National ID</div>
      <div className={styles.value}>{nationID}</div>
    </div>

    <div className={styles.info}>
      <div className={styles.label}>Wallet Addr</div>
      <div className={styles.value}>
        <ShortenAddr addr={walletAddr} />
      </div>
    </div>
  </div>
);
