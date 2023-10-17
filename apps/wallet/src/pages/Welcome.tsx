import { WalletHomeScreen } from '@tw-did/react-library';
import { useNavigate } from '@tanstack/react-router';
import { useCredentials } from '@tw-did/react-library';

export function Welcome() {
  const {credentials} = useCredentials();
  const navigate = useNavigate();

  const gotoRegister = async () => {
    /* TODO: relace with tw-did website */
    window.open('http://127.0.0.1:4201/', '_blank');
    return;
  };

  const gotoSelect = async () => {
    navigate({ to: '/select-credential' });
    return;
  };

  /* TODO: replace with real user data in credentials*/
  const user = credentials?{
    nationalId: credentials[0].fields[0].value,
    walletAddr: credentials[0].fields[1].value,
  }:undefined;

  return (
    <>
      <WalletHomeScreen
        user={user}
        gotoRegister={gotoRegister}
        gotoSelect={gotoSelect}
      />
    </>
  );
}
