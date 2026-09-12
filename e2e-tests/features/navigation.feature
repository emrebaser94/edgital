Feature: Navigate between the application pages
  As a user
  I want a navigation bar linking to the different pages
  So that I can move between the map and the overview tables

  # Traceability: Requirement 8 (navigation bar with links to map, roads
  # overview, evaluations/statistics, todos).

  Background:
    Given the Road Overview map is loaded

  Scenario Outline: The "<menu>" menu entry opens the matching page
    When Tester opens "<menu>" from the navigation bar
    Then the browser address ends with "<path>"
    And the page shows "<marker>"

    Examples:
      | menu       | path        | marker      |
      | Overview   | /Overview   | FID         |
      | Statistics | /Statistics | Total Roads |
      | Todos      | /Todos      | ACTIONS     |
