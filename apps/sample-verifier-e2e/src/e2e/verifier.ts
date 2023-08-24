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

Given(
  'I have a tw-did Verifiable Credential file of {credentialType}',
  function (credentialType: CredentialType) {
    cy.wrap(credentialType).as('credentialType');
  }
);

When('I upload this Verifiable Credential file', function () {
  cy.get('@credentialType').then((credentialType) => {
    cy.get('[data-testid=credential-file]').selectFile(
      `${credentialType}.json`
    );
  });
  cy.get('[data-testid=credential-form]').submit();
});

When('I upload an invalid Verifiable Credential file', function () {
  cy.get('@credentialType').then((credentialType) => {
    cy.get('[data-testid=credential-file]').selectFile(
      `invalid-${credentialType}.json`
    );
  });
  cy.get('[data-testid=credential-form]').submit();
});

Then(/the verification is (successful|failed)/, function (result) {
  if (result === 'successful') {
    cy.get('[data-testid=verification-successful]').should('be.visible');
  } else if (result === 'failed') {
    cy.get('[data-testid=verification-failed]').should('be.visible');
  }
});

Given('I am logged into tw-did', function () {
  // use index 0 of ethereum private keys in fixtures folder to login
  cy.login(0);
});

When(
  'I select the option to choose a credential from tw-did website',
  function () {
    cy.get('[data-testid=select-from-tw-did]').click();
  }
);

When(
  'I choose a {credentialType} Verifiable Credential from tw-did website',
  function (credentialType: CredentialType) {
    cy.get(`[data-testid=credential-type-${credentialType}]`).click();
  }
);
