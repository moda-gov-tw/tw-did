import { useTranslation } from 'react-i18next';
import { QRCodeCanvas } from 'qrcode.react';
import { ConnectionCard } from '../ConnectionsCard/ConnectionCard';
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
  const { t } = useTranslation();
  const steps: Record<StepId, Step> = {
    [StepId.Qrcode]: {
      stepIndex: 0,
      message: t('scanQrCodeOnTwFidoApp'),
      qrcode: spTicketPayload,
      instructions: t('clickPushNotificationOnPhone'),
    },
    [StepId.ConnectFidoFailed]: {
      stepIndex: 0,
      message: t('authenticationFailed'),
      instructions: t('pleaseTryAgain'),
      center: {
        fidoState: 3,
        walletState: 0,
      },
      cta: {
        text: t('connectTwFido'),
        icon: FidoMin,
      },
    },
    [StepId.BindEthereumAccount]: {
      stepIndex: 1,
      message: t('successfullyConnectedToFido'),
      instructions: t('signInWithEthereum'),
      center: {
        fidoState: 2,
        walletState: 1,
      },
      cta: {
        text: t('connectWallet'),
        icon: EthMin,
      },
    },
    [StepId.BindEthereumAccountFailed]: {
      stepIndex: 1,
      message: t('userInjected'),
      instructions: t('pleaseTryAgain'),
      center: {
        fidoState: 2,
        walletState: 3,
      },
      cta: {
        text: t('connectWallet'),
        icon: EthMin,
      },
    },
    [StepId.BindSemaphoreIdentity]: {
      stepIndex: 2,
      message: t('informationPrepared'),
      instructions: t('confirmAndBindWallet'),
      center: {
        fidoState: 2,
        walletState: 2,
      },
      cta: {
        text: t('bind'),
        icon: EthMin,
      },
    },
    [StepId.BindSemaphoreIdentityFailed]: {
      stepIndex: 2,
      message: t('bindingFailed'),
      instructions: t('pleaseTryAgain'),
      center: { bindState: 2 },
      cta: {
        text: t('bind'),
        icon: EthMin,
      },
    },
    [StepId.ViewCredentials]: {
      stepIndex: 3,
      message: t('successfullyBound'),
      instructions: t('credentialsGenerated'),
      center: { bindState: 1 },
      cta: {
        text: t('viewCredential'),
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
