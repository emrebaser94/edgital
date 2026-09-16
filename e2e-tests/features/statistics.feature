@statistics @req-6
Feature: Review aggregate road statistics
  As a user
  I want average statistics over all roads with a chart and a table
  So that I can understand the overall network condition

  # Traceability: Requirement 6 (sidebar/table with diagrams showing average
  # statistics over all roads, e.g. average GW).

  Background:
    Given Paul has opened the Statistics page

  Scenario: The statistics page summarises all roads
    Then he should see the statistics chart
    And he should see 773 total roads in the statistics table
    And he should see an average GW value in the statistics table

  Scenario: The average GW shown in the UI matches the value computed from the API
    Then he should see an Average GW matching the value computed from the roads endpoint

  Scenario: The charted values are readable as text
    # A canvas holds no elements, so the chart also publishes its numbers as a
    # table - assertable here and readable by screen readers.
    Then he should see chart values for the evaluations "GW, TWGEB, TWOFS, TWRIO, TWSUB, TWEBEN"
    And he should see a charted "gw" average matching the value computed from the roads endpoint
