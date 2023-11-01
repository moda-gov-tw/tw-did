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
  const dialogController = useDialog();
  const revokeDialog: DialogProps = {
    title: 'Are you sure to revoke?',
    children: `Wallet address will not be bind to your national ID anymore.`,
    actions: [
      {
        text: 'Cancel',
        onClick: () => {
          dialogController.close();
        },
        type: 'secondary',
      },
      {
        text: 'Revoke',
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
    title: 'Are you sure to logout?',
    children: `You will not be able to access your wallet anymore.`,
    actions: [
      {
        text: 'Cancel',
        onClick: () => {
          dialogController.close();
        },
        type: 'secondary',
      },
      {
        text: 'Logout',
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
    title: 'Done Successfully',
    children: 'The app will be closed.',
    actions: [
      {
        text: 'OK',
        onClick: () => {
          dialogController.close();
          onClose && onClose();
        },
        type: 'primary',
      },
    ],
  };
  const errorDialog: DialogProps = {
    title: 'Some error happened',
    children: 'Please try again later.',
    actions: [
      {
        text: 'Cancel',
        onClick: () => {
          dialogController.close();
        },
        type: 'secondary',
      },
      {
        text: 'Revoke',
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
            <div className={styles.Instructions}>Lost your wallet?</div>
            <Button onClick={confirmRevoke} text="Revoke Binding" />
          </>
        )}
        {onLogout && <Button onClick={confirmLogout} text="Logout" />}
        {dialogController.props && <Dialog {...dialogController.props} />}
      </div>
    </Container>
  );
};
