import { ReactNode, useCallback, useMemo, useState } from 'react';
import styles from './dialog.module.scss';
import { Button, buttonProps } from '../button';

export interface DialogProps {
  className?: string;
  children: ReactNode;
  title: string;
  actions?: buttonProps[];
}

export const useDialog = () => {
  const [props, setProps] = useState<DialogProps | undefined>();
  const open = useCallback((openProps: DialogProps) => {
    openProps && setProps(openProps);
  }, []);
  const close = useCallback(() => setProps(undefined), []);

  const dialogController = useMemo(
    () => ({ open, close, props }),
    [open, close, props]
  );

  return dialogController;
};

export const Dialog = ({ children, title, actions }: DialogProps) => {
  return (
    <div className={styles.DialogOverlay}>
      <div className={styles.Dialog}>
        <div className={styles.DialogHeader}>{title}</div>
        <div className={styles.DialogBody}>{children}</div>
        <div className={styles.DialogFooter}>
          {actions?.map((props, index) => (
            <Button key={index} {...props} />
          ))}
        </div>
      </div>
    </div>
  );
};
