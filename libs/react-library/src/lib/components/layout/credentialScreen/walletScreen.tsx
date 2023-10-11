import { CredentialType } from '../../../contexts';
import { Container, FlexSpace } from '../../common/container';
import { CredentialCardList } from '../credentialCard/CredentialCardList';
import { Button } from '../../common/button';
import styles from './credentialScreen.module.scss';

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
  actionLabels: ['Select'],
  onAction: (index: number, actionLabel: string) => {},
};

export const WalletScreen = () => {
  return (
    <>
      <Container>
        <div className={styles.CredentialScreen}>
          <CredentialCardList {...testProps} />
          <FlexSpace />
        </div>
      </Container>
    </>
  );
};
