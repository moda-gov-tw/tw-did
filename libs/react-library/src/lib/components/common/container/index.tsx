import styles from './container.module.scss';
import theme from '../../../styles/theme.module.scss';

export const Container = ({ children }: { children: any }) => (
    <div className={styles.Container + ' ' + theme.theme_light}>
        {children}
    </div>
);

export const FlexSpace = () => <div className={styles.FlexSpace} />;