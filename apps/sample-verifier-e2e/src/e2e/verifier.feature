@skip
Feature: Verifying tw-did Verifiable Credential on sample-verifier website

  As a user,
  I want to verify my tw-did Verifiable Credential on the sample-verifier website,
  So I can access the services as a Taiwanese resident.

  Background:
    Given I am on the sample-verifier website

  Scenario Outline: Successful verification using the file-based method
    Given I have a tw-did Verifiable Credential file of <credentialType>
    When I upload this Verifiable Credential file
    Then the verification succeeds

  Examples:
    | credentialType |
    | ethereum       |
    | semaphore      |

  Scenario Outline: Failed verification using the file-based method
    Given I have a tw-did Verifiable Credential file of <credentialType>
    When I upload an invalid Verifiable Credential file
    Then the verification fails

  Examples:
    | credentialType |
    | ethereum       |
    | semaphore      |

  Scenario Outline: Successful verification using the direct tw-did selection method
    Given I am logged into tw-did
    When I choose a <credentialType> Verifiable Credential from tw-did website
    Then the verification succeeds

  Examples:
    | credentialType |
    | ethereum       |
    | semaphore      |
