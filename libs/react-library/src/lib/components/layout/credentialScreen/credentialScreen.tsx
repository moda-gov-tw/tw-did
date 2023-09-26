import { CredentialType } from '../../../contexts';
import { Container, FlexSpace } from '../../common/container';
import { CredentialCardList } from '../credentialCard/CredentialCardList';
import { Button } from '../../common/button';
import styles from './credentialScreen.module.scss';
import { Dialog, useDialog, DialogProps } from '../../common/dialog';

const testProps = {
  credentials: [
    {
      type: CredentialType.ETHEREUM,
      fields: [
        { key: 'national-id', value: 'A123456789' },
        { key: 'ethereum-account-address', value: '0x1234567890abcdef' },
      ],
    },
    {
      type: CredentialType.SEMAPHORE,
      fields: [
        { key: 'national-id', value: 'A123456789' },
        { key: 'ethereum-account-address', value: '0x1234567890abcdef' },
      ],
      description: 'You are in Taiwan DID sempahore group',
    },
  ],
  actionLabels: ['Download'],
  onAction: (index: number, actionLabel: string) => {},
};

export const CredentialScreen = ({
  onRevoke,
  onAction,
}: {
  onRevoke?: () => void;
  onAction?: () => void;
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
        onClick: () => {
          onRevoke && onRevoke();
          handleDone();
        },
        type: 'danger'
      },
    ],
  };
  const doneDialog: DialogProps = {
    title: 'Revoked Successfully',
    children: 'The app will be closed.',
    actions: [
      {
        text: 'OK',
        onClick: () => {
          dialogController.close();
        },
        type: 'primary',
      },
    ],
  };
  function handleRevoke() {
    dialogController.open(revokeDialog);
  }
  function handleDone() {
    dialogController.open(doneDialog);
  }

  return (
    <>
      <Container>
        <div className={styles.CredentialScreen}>
          <CredentialCardList {...testProps} />
          <FlexSpace />
          {onRevoke && (
            <>
              <div className={styles.Instructions}>Lost your wallet?</div>
              <Button onClick={handleRevoke} text="Revoke Binding" />
            </>
          )}
          {onRevoke && dialogController.props && (
            <Dialog {...dialogController.props} />
          )}
        </div>
      </Container>
    </>
  );
};
