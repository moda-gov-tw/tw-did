import styles from './container.module.scss';
import theme from '../../../styles/theme.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Container = ({ children }: { children: any }) => (
  <div className={styles.Container + ' ' + theme.theme_light}>{children}</div>
);

export const FlexSpace = () => <div className={styles.FlexSpace} />;
