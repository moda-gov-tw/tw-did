import { ReactNode } from 'react';
import styles from './button.module.scss';
import { Link } from '@tanstack/react-router';

export const Button = ({ onClick, icon, text, props }:
    { onClick: any, icon?: () => ReactNode, text?: string, props?: any }) => {
    const buttonProps = {
        onClick: onClick,
        className: styles.Button,
    };
    return <button {...buttonProps}>{text}{icon && icon()}</button>;
}

export const LinkButton = ({ children, link, props }: { children: any, link: string, props?: any }) => {
    const buttonProps = {
        to: link,
        className: styles.Button,
    };

    return <Link {...buttonProps}>{children}</Link>
}