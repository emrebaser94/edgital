Feature: Review aggregate road statistics
  As a user
  I want average statistics over all roads with a chart and a table
  So that I can understand the overall network condition

  # Traceability: Requirement 6 (sidebar/table with diagrams showing average
  # statistics over all roads, e.g. average GW).

  Scenario: The statistics page summarises all roads
    Given Tester is on the Statistics page
    Then the statistics chart is displayed
    And the statistics table reports 773 total roads
    And the statistics table reports an average GW value

  Scenario: The average GW shown in the UI matches the value computed from the API
    Given Tester is on the Statistics page
    Then the displayed Average GW matches the value computed from the roads endpoint
