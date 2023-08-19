import React from 'react';
import CredentialCard, { CredentialCardProps } from './CredentialCard';

interface CredentialCardListProps {
  credentials: CredentialCardProps[];
}

const CredentialCardList: React.FC<CredentialCardListProps> = ({
  credentials,
}) => {
  return (
    <div className="credential-view-list">
      {credentials.map((credential, index) => (
        <CredentialCard key={index} {...credential} />
      ))}
    </div>
  );
};

export default CredentialCardList;
