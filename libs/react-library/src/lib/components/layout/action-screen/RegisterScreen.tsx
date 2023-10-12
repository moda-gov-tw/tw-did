import { QRCodeCanvas } from 'qrcode.react';
import { ConnectionCard } from '../connectionsCard';
import { Logo } from '../../common/icons/logo';
import { GoIcon } from '../../common/icons/go';
import { FidoMin } from '../../common/icons/fidoMin';
import { useEffect, useState } from 'react';
import { ReactNode } from 'react';
import { StepIndicator } from '../../common/stepIndicator';
import styles from './layout.module.scss';
import { Button } from '../../common/button';
import { Container, FlexSpace } from '../../common/container';
import { EthMin } from '../../common/icons/ethMin';

interface Props {
  nationalId: string;
  ethereumAccount: string;
  spTicketPayload: string;
  handleFidoLogin: () => void;
  handleEthLogin: () => void;
  handleBind: () => void;
  viewCredential: () => void;
}
interface Step {
  currentStep: number;
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

export const RegisterScreen = ({
  nationalId,
  ethereumAccount,
  spTicketPayload,
  handleFidoLogin,
  handleEthLogin,
  handleBind,
  viewCredential,
}: Props) => {
  const steps = {
    displayQR: {
      currentStep: 0,
      message: 'Scan this QR code on TW FidO mobile app.',
      qrCode: spTicketPayload,
      instructions: 'or click the push notification on your mobile phone',
    },
    connectFidoFailed: {
      currentStep: 0,
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
    },
    connectWallet: {
      currentStep: 1,
      message: 'Successfully connected to your TW-Fido.',
      instructions:
        'Please sign in with ethereum and bind it to your nation identity.',
      center: {
        fidoState: 2,
        walletState: 1,
      },
      cta: {
        text: 'Connect Wallet',
        onClick: connectWallet,
        icon: EthMin,
      },
    },
    connectWalletFailed: {
      currentStep: 1,
      message: 'User injected!',
      instructions: 'Please try again.',
      center: {
        fidoState: 2,
        walletState: 3,
      },
      cta: {
        text: 'Connect Wallet',
        onClick: connectWallet,
        icon: EthMin,
      },
    },
    binding: {
      currentStep: 2,
      message: 'All the information you need has been prepared.',
      instructions: 'Please confirm the information and bind your wallet.',
      center: {
        fidoState: 2,
        walletState: 2,
      },
      cta: {
        text: 'Bind',
        onClick: bind,
        icon: EthMin,
      },
    },
    bindingFailed: {
      currentStep: 2,
      message: 'Binding failed!',
      instructions: 'Please try again.',
      center: { bindState: 2 },
      cta: {
        text: 'Bind',
        onClick: bind,
        icon: EthMin,
      },
    },
    viewCredential: {
      currentStep: 3,
      message: 'Successfully bound to your nation identity.',
      instructions: 'Your credentials are generated. View it now!',
      center: { bindState: 1 },
      cta: {
        text: 'View Credential',
        onClick: viewCredential,
        icon: GoIcon,
      },
    },
  };

  // function isMobile() {
  //   const regex =
  //     /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  //   return regex.test(navigator.userAgent);
  // }

  async function connectFido() {
    // if (!isMobile()) {
    //   setRegState(steps.displayQR);
    // }
    try {
      await handleFidoLogin();
    } catch (e) {
      setRegState(steps.connectFidoFailed);
      return;
    }
    setRegState(steps.connectWallet);
  }

  async function connectWallet() {
    try {
      await handleEthLogin();
    } catch (e) {
      setRegState(steps.connectWalletFailed);
      return;
    }
    setRegState(steps.binding);
  }

  async function bind() {
    try {
      await handleBind();
    } catch (e) {
      setRegState(steps.bindingFailed);
      return;
    }
    setRegState(steps.viewCredential);
  }

  const [regState, setRegState] = useState<Step>(steps.displayQR);

  const { center, qrCode, cta, currentStep, message, instructions } = regState;

  useEffect(() => {
    (async function () {
      try {
        await handleFidoLogin();
      } catch (e) {
        setRegState(steps.connectFidoFailed);
        return;
      }
      setRegState(steps.connectWallet);
    })();
  }, []);

  return (
    <Container>
      <div className={styles.ActionScreen}>
        <div className={styles.Top}>
          <StepIndicator stepCount={4} currentStep={currentStep} />
        </div>

        <FlexSpace />
        <div className={styles.Message}>{message}</div>
        <div className={styles.Center}>
          {center ? (
            <ConnectionCard
              {...center}
              nationID={nationalId}
              walletAddr={ethereumAccount}
            />
          ) : qrCode ? (
            <QRCodeCanvas value={qrCode} />
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
