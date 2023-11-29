import { StepId, RegisterScreen, useTwDid } from '@tw-did/react-library';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { useAccount, useConfig, useConnect } from 'wagmi';

class StepIdNotFoundError extends Error {
  constructor(stepId: StepId) {
    super(`Step ID ${stepId} not found`);
    this.name = 'StepIdNotFoundError';

    Object.setPrototypeOf(this, StepIdNotFoundError.prototype);
  }
}

export function Register() {
  const { connectors } = useConfig();
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect({
    connector: connectors[0],
  });
  const navigate = useNavigate();
  const {
    user,
    loginInfo,
    ethereumLogin,
    updateSemaphoreCommitment,
    generateSemaphoreIdentity,
  } = useTwDid();
  const [currentStep, setCurrentStep] = useState(StepId.Qrcode);
  const [loggedIn, setLoggedIn] = useState(false);

  const ethereumAccount = user?.ethereumAccount || '';

  const handleEthLogin = async () => {
    if (!isConnected) {
      await connectAsync();
    }
    await ethereumLogin();
    setCurrentStep(StepId.BindSemaphoreIdentity);
  };

  const handleBind = async () => {
    const identity = await generateSemaphoreIdentity();
    await updateSemaphoreCommitment(identity.commitment.toString());
    setCurrentStep(StepId.ViewCredentials);
  };

  const viewCredential = useCallback(() => {
    navigate({ to: '/view-credential' });
  }, [navigate]);

  const onAction = async (stepId: StepId) => {
    if (stepId === StepId.BindEthereumAccount) {
      await handleEthLogin();
    } else if (stepId === StepId.BindSemaphoreIdentity) {
      await handleBind();
    } else if (stepId === StepId.ViewCredentials) {
      await viewCredential();
    } else {
      throw new StepIdNotFoundError(stepId);
    }
  };

  useEffect(() => {
    if (user?.token && currentStep === StepId.Qrcode && !loggedIn) {
      if (!user?.ethereumAccount || !user?.semaphoreCommitment) {
        setLoggedIn(true);
        setCurrentStep(StepId.BindEthereumAccount);
      } else {
        viewCredential();
      }
    }
  }, [user, currentStep, loggedIn, setLoggedIn, viewCredential]);

  return (
    <RegisterScreen
      currentStepId={currentStep}
      nationalId={user?.nationalId || ''}
      ethereumAccount={ethereumAccount}
      spTicketPayload={loginInfo?.qrcode?.spTicketPayload || ''}
      onAction={onAction}
    />
  );
}
