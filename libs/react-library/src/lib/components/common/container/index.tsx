import styles from './container.module.scss';

export const Container = ({ children }: { children: any }) => (
    <div className={styles.Container}>{children}</div>
);

export const FlexSpace = () => <div className={styles.FlexSpace} />;