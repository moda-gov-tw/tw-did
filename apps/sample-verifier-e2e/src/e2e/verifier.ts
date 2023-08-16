import { getGreeting } from '../support/app.po';
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';

When('I visit the website', function () {
  cy.visit('/');
});

Then('I should see a text {string}', function (text: string) {
  getGreeting().contains(text);
});
