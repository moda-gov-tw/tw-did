import {
  Given,
  When,
  Then,
  defineParameterType,
} from '@badeball/cypress-cucumber-preprocessor';
import {
  CredentialType,
  generateCredentialType,
} from '../support/credential-types';

defineParameterType(generateCredentialType());

Given('I am on the sample-verifier website', () => {
  cy.visit('/');
});

Given('I am logged into sample-verifier website', () => {
  cy.get('[data-testid=connect-button]').click();
});

Given(
  'I have a tw-did Verifiable Credential file of {credentialType}',
  function (credentialType: CredentialType) {
    cy.wrap(credentialType).as('credentialType');
  }
);

When('I upload this Verifiable Credential file', function () {
  cy.get('@credentialType').then((credentialType) => {
    cy.fixture(`${credentialType}.json`).as('credential');
    cy.get('[data-testid=credential-file]').selectFile('@credential');
  });
  cy.get('[data-testid=verify-credential]').click();
});

When('I upload an invalid Verifiable Credential file', function () {
  cy.get('@credentialType').then((credentialType) => {
    cy.fixture(`invalid-${credentialType}.json`).as('credential');
    cy.get('[data-testid=credential-file]').selectFile('@credential');
  });
  cy.get('[data-testid=verify-credential]').click();
});

Then(/the verification (succeeds|fails)/, function (result) {
  if (result === 'succeeds') {
    cy.get('[data-testid=verification-succeeds]').should('be.visible');
  } else if (result === 'fails') {
    cy.get('[data-testid=verification-fails]').should('be.visible');
  }
});

When(
  'I choose a {credentialType} Verifiable Credential from tw-did website',
  function (credentialType: CredentialType) {
    cy.mockCredentialSelection(credentialType);
    cy.get(`[data-testid=select-on-did]`).click();
    cy.get('[data-testid=verify-credential]').click();
  }
);
