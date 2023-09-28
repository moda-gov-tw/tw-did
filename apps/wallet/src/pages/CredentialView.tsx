import {
  CredentialScreen,
  useAuth,
  useCredentials,
} from '@tw-did/react-library';
import { useNavigate } from '@tanstack/react-router';

export function CredentialView() {
  const { logout } = useAuth();
  const { credentials, sendCredential } = useCredentials();

  const handleDownload = async (data: any) => {
    /* TODO: send to wallet instead of download */
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'data.json';
    link.click();
  };

  const handleRevoke = async () => {
    /* TODO: handle revoke */
  };

  const handleLogout = async () => {
    await logout();
  };

  const navigate = useNavigate();
  const handleClose = async () => {
    navigate({ to: '/' });
  };

  /* TODO: get from AuthContext */
  const checkLogin = () => {
    return localStorage.getItem('user') ? true : false;
  }

  return (
    <div>
      <CredentialScreen
        credentials={credentials}
        actionLabels={['download']}
        onAction={(index, label) => {
          if (label == 'download')
            handleDownload(credentials[index].verifiableCredential);
          else return;
        }}
        onRevoke={handleRevoke}
        onLogout={handleLogout}
        onClose={handleClose}
        checkLogin={checkLogin}
      />
    </div>
  );
}
