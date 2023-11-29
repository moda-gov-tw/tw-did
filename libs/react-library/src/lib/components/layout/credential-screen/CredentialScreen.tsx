import { useTranslation } from 'react-i18next';
import { Container, FlexSpace } from '../../common/container';
import { CredentialCardList } from '../CredentialCard/CredentialCardList';
import { Button } from '../../common/button';
import styles from './CredentialScreen.module.scss';
import { Dialog, useDialog, DialogProps } from '../../common/dialog';
import { ActionId, CredentialMap, CredentialType } from '../../../hooks';

export const CredentialScreen = ({
  onRevoke,
  onAction,
  onLogout,
  onClose,
  credentials,
}: {
  onRevoke?: () => void;
  onAction: (credentialkey: CredentialType, actionId: ActionId) => void;
  credentials: CredentialMap;
  onLogout?: () => void;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const dialogController = useDialog();
  const revokeDialog: DialogProps = {
    title: t('confirmRevoke'),
    children: t('revokeWarning'),
    actions: [
      {
        text: t('cancel'),
        onClick: () => {
          dialogController.close();
        },
        type: 'secondary',
      },
      {
        text: t('revoke'),
        onClick: async () => {
          try {
            onRevoke && (await onRevoke());
          } catch (e) {
            notifyError();
          }
        },
        type: 'danger',
      },
    ],
  };
  const logoutDialog: DialogProps = {
    title: t('confirmLogout'),
    children: t('logoutWarning'),
    actions: [
      {
        text: t('cancel'),
        onClick: () => {
          dialogController.close();
        },
        type: 'secondary',
      },
      {
        text: t('logout'),
        onClick: async () => {
          try {
            onLogout && (await onLogout());
          } catch (e) {
            notifyError();
          }
          notifyDone();
        },
        type: 'danger',
      },
    ],
  };
  const doneDialog: DialogProps = {
    title: t('doneSuccessfully'),
    children: t('appClosing'),
    actions: [
      {
        text: t('ok'),
        onClick: () => {
          dialogController.close();
          onClose && onClose();
        },
        type: 'primary',
      },
    ],
  };
  const errorDialog: DialogProps = {
    title: t('errorOccurred'),
    children: t('tryAgainLater'),
    actions: [
      {
        text: t('cancel'),
        onClick: () => {
          dialogController.close();
        },
        type: 'secondary',
      },
      {
        text: t('revoke'),
        onClick: async () => {
          try {
            onRevoke && (await onRevoke());
          } catch (e) {
            notifyError();
          }
        },
        type: 'danger',
      },
    ],
  };
  function confirmRevoke() {
    dialogController.open(revokeDialog);
  }
  function confirmLogout() {
    dialogController.open(logoutDialog);
  }
  function notifyDone() {
    dialogController.open(doneDialog);
  }
  function notifyError() {
    dialogController.open(errorDialog);
  }

  return (
    <Container>
      <div className={styles.CredentialScreen}>
        {credentials && (
          <CredentialCardList credentials={credentials} onAction={onAction} />
        )}
        <FlexSpace />
        {onRevoke && (
          <>
            <div className={styles.Instructions}>{t('lostYourWallet')}</div>
            <Button onClick={confirmRevoke} text={t('revokeBinding')} />
          </>
        )}
        {onLogout && <Button onClick={confirmLogout} text={t('logout')} />}
        {dialogController.props && <Dialog {...dialogController.props} />}
      </div>
    </Container>
  );
};
