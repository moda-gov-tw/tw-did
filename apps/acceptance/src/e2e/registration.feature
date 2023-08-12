# Feature specifications sourced from /docs/requirements.md
# Requirement ID: REQ-01, REQ-03

Feature: Binding ID to Ethereum Address

  As a user
  I want to bind my ID with an Ethereum address
  So that my identity is linked with my blockchain account

  Background:
    Given I am on the "registration-page"

  Scenario: User inputs ID
    When I enter my ID
    And I click on "next"
    Then the "qr-code-interface" should be presented

  Scenario: User confirms identity with TW FidO app
    Given I authenticate with TW FidO app
    Then the website should verify my app login status via the API
    And redirect me to the "ethereum-address-confirmation" page

  Scenario: Ethereum address confirmation via wallet app signature
    Given I authenticate with TW FidO app
    And I am on the "ethereum-sign-in-page"
    When I click on "sign-in-with-ethereum"
    And I complete the signature process in the wallet app
    And the website receives the signature result
    Then the website should successfully verify the signature result
    And I should be redirected to the confirmation page

  Scenario: Successful ID and Ethereum Address Binding
    Given I authenticate with TW FidO app
    And I authenticate with Sign-in with Ethereum
    And I am on the "binding-confirmation-page"
    When I click on "binding"
    Then the "successful-binding-message" should be presented
    And a list of my current credentials should be presented
    And all credentials are valid
