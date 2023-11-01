import { ReactNode } from 'react';
import styles from './button.module.scss';

export interface buttonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: any;
  icon?: () => ReactNode;
  text?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
