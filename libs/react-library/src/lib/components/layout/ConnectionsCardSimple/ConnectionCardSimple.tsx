import { useTranslation } from 'react-i18next';
import styles from './ConnectionCardSimple.module.scss';
import { ShortenAddr } from '../../common/shortenAddr';

export const ConnectionCardSimple = ({
  nationID,
  walletAddr,
}: {
  nationID: string;
  walletAddr: string;
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.ConnectionCardSimple}>
      <div className={styles.info}>
        <div className={styles.label}>{t('nationalId')}</div>
        <div className={styles.value}>{nationID}</div>
      </div>

      <div className={styles.info}>
        <div className={styles.label}>{t('walletAddress')}</div>
        <div className={styles.value}>
          <ShortenAddr addr={walletAddr} />
        </div>
      </div>
    </div>
  );
};
