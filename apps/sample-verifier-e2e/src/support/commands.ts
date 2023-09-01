// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    mockCredentialSelection(credentialType: string): void;
  }
}

Cypress.Commands.add('mockCredentialSelection', (credentialType: string) => {
  cy.fixture(`${credentialType}.json`).as('credential');
  cy.window().then((win) => {
    cy.stub(win, 'open');
  });
  cy.fixture(`${credentialType}.json`).then((credential) => {
    cy.window().then((win) => {
      const originalAddEventListener = win.addEventListener;
      win.addEventListener = (type, listener, options) => {
        if (type === 'message') {
          listener({
            origin: 'http://localhost:4201',
            data: {
              action: 'select-credential',
              payload: credential,
            },
          });
        } else {
          originalAddEventListener(type, listener, options);
        }
      };
    });
  });
});
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
