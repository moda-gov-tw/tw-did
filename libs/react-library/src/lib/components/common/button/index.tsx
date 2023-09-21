import styles from './button.module.scss';
import { Link } from '@tanstack/react-router';

export const Button = ({ children, onClick, props }: { children: any, onClick: any, props?: any }) => {
    const buttonProps = {
        onClick: onClick,
        className: styles.Button,
    };

    return <button {...buttonProps}>{children}</button>;
}

export const LinkButton = ({ children, link, props }: { children: any, link: string, props?: any }) => {
    const buttonProps = {
        to: link,
        className: styles.Button,
    };

    return <Link {...buttonProps}>{children}</Link>
}