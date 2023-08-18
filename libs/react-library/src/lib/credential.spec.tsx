import { expect, it, describe, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import Credential, { CredentialProps } from './credential';

describe('<Credential />', () => {
  const baseProps: CredentialProps = {
    type: 'ethereum',
    description: 'Test description',
    fields: [
      { key: 'national-id', value: 'A123456789' },
      { key: 'ethereum-account-address', value: '0x1234567890abcdef' },
    ],
    actions: [
      {
        label: 'Test Action',
        handler: vi.fn(),
      },
    ],
  };

  it('renders the type correctly', () => {
    const { getByTestId } = render(<Credential {...baseProps} />);
    expect(getByTestId('credential-type-ethereum')).toBeInTheDocument();
  });

  it('renders the description if provided', () => {
    const { getByTestId } = render(<Credential {...baseProps} />);
    expect(getByTestId('credential-description')).toHaveTextContent(
      'Test description'
    );
  });

  it('renders all the fields correctly', () => {
    const { getByTestId } = render(<Credential {...baseProps} />);
    expect(getByTestId('field-key-national-id')).toHaveTextContent(
      'national-id'
    );
    expect(getByTestId('field-value-national-id')).toHaveTextContent(
      'A123456789'
    );
  });

  it('renders all the actions and they can be triggered', () => {
    const { getByTestId } = render(<Credential {...baseProps} />);
    const actionButton = getByTestId('credential-action-Test Action');
    expect(actionButton).toBeTruthy();

    fireEvent.click(actionButton);
    expect(baseProps.actions[0].handler).toHaveBeenCalled();
  });
});
