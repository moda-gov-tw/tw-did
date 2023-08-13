Feature: web
  Scenario: visiting the frontpage
    When I visit the website
    Then I should see a text "Welcome sample-verifier"
