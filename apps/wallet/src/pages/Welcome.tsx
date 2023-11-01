import { CredentialType, WalletHomeScreen } from '@tw-did/react-library';
import { useCredentials, CredentialMode } from '@tw-did/react-library';
import { useNavigate } from '@tanstack/react-router';

export function Welcome() {
  const credentials = useCredentials(CredentialMode.List);
  const navigate = useNavigate();

  const gotoRegister = async () => {
    /* TODO: replace with tw-did website */
    window.open('http://localhost:4200/', '_blank');
    return;
  };

  const gotoView = async () => {
    navigate({ to: '/view-credential' });
    return;
  }

  const gotoSelect = async () => {
    navigate({ to: '/select-credential' });
    return;
  }
  
  /* TODO: the credentials should be loaded from ls */
  /* TODO: let user be undefined if no credential stored */
  const user = credentials ? {
    nationalId: credentials[CredentialType.ETHEREUM].fields[0].value,
    walletAddr: credentials[CredentialType.ETHEREUM].fields[1].value,
  } : undefined;

  return (
    <>
      <WalletHomeScreen
        user={user}
        mode='view' // TODO: change to 'select' if requested
        gotoRegister={gotoRegister}
        gotoView={gotoView}
        gotoSelect={gotoSelect}
      />
    </>
  );
}
