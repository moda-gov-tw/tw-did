import styles from './layout.module.scss';
import { Button } from '../../common/button';
import { Container, FlexSpace } from '../../common/container';
import { ConnectionCard } from '../connectionsCard';
import { Logo } from '../../common/icons/logo';
import { ReactNode, useState } from 'react';
import { FidoMin } from '../../common/icons/fidoMin';
import { GoIcon } from '../../common/icons/go';

interface Props {
  nationID: string;
  walletAddr: string;
  fidoQR: string;
  handleFidoLogin: () => void;
  viewCredential: () => void;
}

interface Step {
  message: string;
  instructions: string;
  center?: {
    fidoState?: number;
    walletState?: number;
    bindState?: number;
  };
  qrCode?: string;
  cta?: {
    text: string;
    onClick: () => void;
    icon?: () => ReactNode;
  };
}

export const LoginScreen = ({
  nationID,
  walletAddr,
  fidoQR,
  handleFidoLogin,
  viewCredential,
}: Props) => {
  const steps = {
    connectFido: {
      message: 'You have bind your wallet to your nation identity.',
      instructions: 'Please login with TW-Fido to access your credentials',
      center: {
        bindState: 1,
      },
      cta: {
        text: 'Connect TW Fido',
        onClick: connectFido,
        icon: FidoMin,
      },
    },
    displayQR: {
      message: 'Scan this QR code on TW FidO mobile app.',
      qrCode: fidoQR,
      instructions: 'or click the push notification on your mobile phone',
    },
    connectFidoFailed: {
      message: 'Authenticate failed!',
      instructions: 'Please try again.',
      center: {
        fidoState: 3,
        walletState: 0,
      },
      cta: {
        text: 'Connect TW Fido',
        onClick: connectFido,
        icon: FidoMin,
      },
    }
  };

  function isMobile() {
    const regex =
      /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
  }

  async function connectFido() {
    if (!isMobile()) {
      setloginState(steps.displayQR);
    }
    try {
      await handleFidoLogin();
    } catch (e) {
      setloginState(steps.connectFidoFailed);
    }
    viewCredential();
  }

  const [loginState, setloginState] = useState<Step>(steps.connectFido);

  const { center, qrCode, cta, message, instructions } = loginState;

  return (
    <Container>
      <div className={styles.ActionScreen}>
        <FlexSpace />
        <div className={styles.Message}>{message}</div>
        <div className={styles.Center}>
          {center ? (
            <ConnectionCard
              {...center}
              nationID={nationID}
              walletAddr={walletAddr}
            />
          ) : qrCode ? (
            <img src={qrCode} />
          ) : (
            <Logo />
          )}
        </div>

        <FlexSpace />
        {instructions && (
          <div className={styles.Instructions}>{instructions}</div>
        )}
        {cta && <Button {...cta} type="primary" />}
      </div>
    </Container>
  );
};
