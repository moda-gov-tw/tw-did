import styles from './background.module.scss';
import { ReactNode } from 'react';
import sm from './img/bg-sm.svg';
import md from './img/bg-md.svg';

export const BackgroundContainer = ({ children }: { children: ReactNode }) =>
    <div className={styles.Background} >
        {children}
    </div>;

export const bgimgs = () => ({
    sm,
    md
});
