# Feature specifications sourced from /docs/requirements.md
# Requirement ID: REQ-02

Feature: Revoking ID and Ethereum Address Binding

  As a user
  I want to revoke the binding of my ID with an Ethereum address
  So that my identity is no longer linked with my blockchain account

  Background:
    Given I am on the revocation page
    And I have a credential that binds my ID with an Ethereum address

  Scenario: User initiates the revocation process
    When I enter my ID
    And I click on "next"
    Then the "qr-code-interface" should be presented

  Scenario: User confirms identity with TW FidO app
    Given the QR code is displayed
    When I scan the QR code with TW FidO app and log in
    Then the website should verify my app login status via the API
    And redirect me to the "revocation-confirmation" page

  Scenario: Successful revocation confirmation
    Given I am on the revocation confirmation page
    When I click on "confirm"
    Then the "successfully-revoked-message" should be presented
    And the credential is no longer valid
