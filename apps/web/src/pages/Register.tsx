import { StepId, RegisterScreen, useAuth } from '@tw-did/react-library';
import { signMessage } from '@wagmi/core';
import { Identity } from '@semaphore-protocol/identity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useConfig, useConnect } from 'wagmi';

class StepIdNotFoundError extends Error {
  constructor(stepId: StepId) {
    super(`Step ID ${stepId} not found`);
    this.name = 'StepIdNotFoundError';

    Object.setPrototypeOf(this, StepIdNotFoundError.prototype);
  }
}

export function Register() {
  const { connectors } = useConfig();
  const { connect } = useConnect({
    connector: connectors[0],
  });
  const navigate = useNavigate();
  const { user, loginInfo, ethereumLogin, updateSemaphoreCommitment } =
    useAuth();
  const [currentStep, setCurrentStep] = useState(StepId.Qrcode);

  const ethereumAccount = user?.ethereumAccount || '';

  useEffect(() => {
    if (user?.token && currentStep === StepId.Qrcode) {
      setCurrentStep(StepId.BindEthereumAccount);
    }
  }, [user, currentStep]);

  const handleEthLogin = async () => {
    connect();
    await ethereumLogin();
    setCurrentStep(StepId.BindSemaphoreIdentity);
  };

  const handleBind = async () => {
    const message = `Sign this message to generate your Semaphore identity.`;
    const result = await signMessage({ message });
    const identity = new Identity(result);
    await updateSemaphoreCommitment(identity.commitment.toString());
    setCurrentStep(StepId.ViewCredentials);
  };

  const viewCredential = () => {
    navigate({ to: '/view-credential' });
  };

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
