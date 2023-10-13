import {
  CredentialScreen,
  useAuth,
  useCredentials,
} from '@tw-did/react-library';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';

export function CredentialView() {
  const { logout, user } = useAuth();
  const { credentials } = useCredentials();

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
  const checkLogin = useCallback(() => {
    return !!user;
  }, [user]);

  return (
    <div>
      <CredentialScreen
        credentials={credentials}
        actionLabels={['download']}
        onAction={(index, label) => {
          if (label === 'download')
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
