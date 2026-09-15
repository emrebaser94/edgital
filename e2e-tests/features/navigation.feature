@navigation @req-8
Feature: Navigate between the application pages
  As a user
  I want a navigation bar linking to the different pages
  So that I can move between the map and the overview tables

  # Traceability: Requirement 8 (navigation bar with links to map, roads
  # overview, evaluations/statistics, todos).

  Background:
    Given Paul has opened the Road Overview map

  Scenario Outline: The "<menu>" menu entry opens the matching page
    When he opens "<menu>" from the navigation bar
    Then he should see the browser address ending with "<path>"
    And he should see "<marker>" on the page

    Examples:
      | menu       | path        | marker      |
      | Overview   | /Overview   | FID         |
      | Statistics | /Statistics | Total Roads |
      | Todos      | /Todos      | ACTIONS     |
