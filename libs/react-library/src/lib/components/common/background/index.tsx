import styles from './background.module.scss';
import { ReactNode } from 'react';

export const BackgroundContainer = ({ children }: { children: ReactNode }) =>
    <div className={styles.Background} >
        {children}
    </div>;