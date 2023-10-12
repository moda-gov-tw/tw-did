import { ReactNode } from 'react';
import styles from './button.module.scss';
import { Link } from '@tanstack/react-router';

export interface buttonProps {
  onClick: any;
  icon?: () => ReactNode;
  text?: string;
  props?: any;
  type?: 'danger' | 'primary' | 'secondary' | 'link';
}

export const Button = ({ onClick, icon, text, type, props }: buttonProps) => {
  const buttonProps = {
    onClick: onClick,
    className: styles.Button + ' ' + (type ? styles[type] : ''),
  };
  return (
    <button {...buttonProps}>
      {text}
      {icon && icon()}
    </button>
  );
};

export const LinkButton = ({
  children,
  link,
}: {
  children: any;
  link: string;
}) => {
  const buttonProps = {
    href: link,
    className: styles.Button,
  };

  return <a {...buttonProps}>{children}</a>;
};
