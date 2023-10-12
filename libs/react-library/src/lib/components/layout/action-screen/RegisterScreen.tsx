import { QRCodeCanvas } from 'qrcode.react';
import { ConnectionCard } from '../connectionsCard';
import { Logo } from '../../common/icons/logo';
import { GoIcon } from '../../common/icons/go';
import { FidoMin } from '../../common/icons/fidoMin';
import { ReactNode } from 'react';
import { StepIndicator } from '../../common/stepIndicator';
import styles from './layout.module.scss';
import { Button } from '../../common/button';
import { Container, FlexSpace } from '../../common/container';
import { EthMin } from '../../common/icons/ethMin';

interface Props {
  currentStepId: StepId;
  nationalId: string;
  ethereumAccount: string;
  spTicketPayload: string;
  onAction: (stepId: StepId) => void;
}
interface Step {
  stepIndex: number;
  message: string;
  instructions: string;
  center?: {
    fidoState?: number;
    walletState?: number;
    bindState?: number;
  };
  qrcode?: string;
  cta?: {
    text: string;
    icon?: () => ReactNode;
  };
}

export enum StepId {
  Qrcode = 'Qrcode',
  BindEthereumAccount = 'BindEthereumAccount',
  BindSemaphoreIdentity = 'BindSemaphoreIdentity',
  ConnectFidoFailed = 'ConnectFidoFailed',
  BindSemaphoreIdentityFailed = 'BindSemaphoreIdentityFailed',
  ViewCredentials = 'ViewCredentials',
  BindEthereumAccountFailed = 'BindEthereumAccountFailed',
}

export const RegisterScreen = ({
  currentStepId,
  nationalId,
  ethereumAccount,
  spTicketPayload,
  onAction,
}: Props) => {
  const steps: Record<StepId, Step> = {
    [StepId.Qrcode]: {
      stepIndex: 0,
      message: 'Scan this QR code on TW FidO mobile app.',
      qrcode: spTicketPayload,
      instructions: 'or click the push notification on your mobile phone',
    },
    [StepId.ConnectFidoFailed]: {
      stepIndex: 0,
      message: 'Authenticate failed!',
      instructions: 'Please try again.',
      center: {
        fidoState: 3,
        walletState: 0,
      },
      cta: {
        text: 'Connect TW Fido',
        icon: FidoMin,
      },
    },
    [StepId.BindEthereumAccount]: {
      stepIndex: 1,
      message: 'Successfully connected to your TW-Fido.',
      instructions:
        'Please sign in with ethereum and bind it to your nation identity.',
      center: {
        fidoState: 2,
        walletState: 1,
      },
      cta: {
        text: 'Connect Wallet',
        icon: EthMin,
      },
    },
    [StepId.BindEthereumAccountFailed]: {
      stepIndex: 1,
      message: 'User injected!',
      instructions: 'Please try again.',
      center: {
        fidoState: 2,
        walletState: 3,
      },
      cta: {
        text: 'Connect Wallet',
        icon: EthMin,
      },
    },
    [StepId.BindSemaphoreIdentity]: {
      stepIndex: 2,
      message: 'All the information you need has been prepared.',
      instructions: 'Please confirm the information and bind your wallet.',
      center: {
        fidoState: 2,
        walletState: 2,
      },
      cta: {
        text: 'Bind',
        icon: EthMin,
      },
    },
    [StepId.BindSemaphoreIdentityFailed]: {
      stepIndex: 2,
      message: 'Binding failed!',
      instructions: 'Please try again.',
      center: { bindState: 2 },
      cta: {
        text: 'Bind',
        icon: EthMin,
      },
    },
    [StepId.ViewCredentials]: {
      stepIndex: 3,
      message: 'Successfully bound to your nation identity.',
      instructions: 'Your credentials are generated. View it now!',
      center: { bindState: 1 },
      cta: {
        text: 'View Credential',
        icon: GoIcon,
      },
    },
  };

  const {
    center,
    qrcode: qrCode,
    cta,
    stepIndex: currentStep,
    message,
    instructions,
  } = steps[currentStepId];

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
        {cta && (
          <Button
            {...cta}
            onClick={() => onAction(currentStepId)}
            type="primary"
          />
        )}
      </div>
    </Container>
  );
};
