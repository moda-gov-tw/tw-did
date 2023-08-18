import React from 'react';
import Credential, { CredentialProps } from './credential';

interface CredentialListProps {
  credentials: CredentialProps[];
}

const CredentialList: React.FC<CredentialListProps> = ({ credentials }) => {
  return (
    <div className="credential-list">
      {credentials.map((credential, index) => (
        <Credential key={index} {...credential} />
      ))}
    </div>
  );
};

export default CredentialList;
