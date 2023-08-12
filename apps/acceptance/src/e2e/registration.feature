# Feature specifications sourced from /docs/requirements.md
# Requirement ID: REQ-01

Feature: Binding ID to Ethereum Address

  As a user
  I want to bind my ID with an Ethereum address
  So that my identity is linked with my blockchain account

  Background:
    Given I am on the registration page

  Scenario: User inputs ID
    When I enter my ID
    And I click on "next"
    Then the "qr-code-interface" should be presented

  Scenario: User confirms identity with TW FidO app
    Given the QR code is displayed
    When I scan the QR code with TW FidO app and log in
    Then the website should verify my app login status via the API
    And redirect me to the "ethereum-address-confirmation" page

  Scenario: Ethereum address confirmation via wallet app signature
    Given I am on the Ethereum sign-in page
    When I click on "sign-in-with-ethereum"
    And I complete the signature process in the wallet app
    And the website receives and verifies the signature result
    Then I should be redirected to the confirmation page

  Scenario: Successful ID and Ethereum Address Binding
    Given my ID and Ethereum account address are displayed
    When I click on "binding"
    Then the "successful-binding-message" should be presented
    And a list of my current credentials should be presented
    And all credentials are valid
