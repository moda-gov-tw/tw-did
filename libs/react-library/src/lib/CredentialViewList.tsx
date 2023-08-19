import React from 'react';
import CredentialView, { CredentialProps } from './CredentialView';

interface CredentialViewListProps {
  credentials: CredentialProps[];
}

const CredentialViewList: React.FC<CredentialViewListProps> = ({
  credentials,
}) => {
  return (
    <div className="credential-view-list">
      {credentials.map((credential, index) => (
        <CredentialView key={index} {...credential} />
      ))}
    </div>
  );
};

export default CredentialViewList;
