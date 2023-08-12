# Feature specifications sourced from /docs/requirements.md
# Requirement ID: REQ-04

Feature: Binding ID to an EVM-compatible Blockchain Address Across Various Networks

  As a user
  I want to bind my ID to an address on an EVM-compatible blockchain
  So that my identity is linked with my blockchain account

  Background:
    Given I am on the "registration-page"
    And enable multinet support
    And I authenticate with TW FidO app

  Scenario Outline: EVM-compatible Network address confirmation via wallet app signature
    Given I am on the "ethereum-sign-in-page"
    When I select a network "<network>"
    And I click on "sign-in-with-ethereum"
    And I complete the signature process in the wallet app
    And the website receives the signature result
    Then the website should successfully verify the signature result
    And I should be redirected to the confirmation page

    Examples:
      | network  |
      | mainnet  |
      | polygon  |
      | goerli   |

  Scenario Outline: Successful ID and EVM-compatible Network Address Binding
    Given I authenticate with Sign-in with Ethereum
    And I am on the "binding-confirmation-page"
    And the selected network is "<network>"
    When I click on "binding"
    Then the "successful-binding-message" should be presented
    And a list of my current credentials should be presented
    And all credentials are valid

    Examples:
      | network  |
      | mainnet  |
      | polygon  |
      | goerli   |
