@todos
Feature: Capture maintenance Todos from the map
  As a road maintenance planner
  I want to record a Todo for a road directly from the map
  So that measures are tracked against the correct road

  # Traceability: Requirement 7 (Abschnitt 4) — add a Todo (title, description,
  # status, author, road_fid) via a modal opened by clicking a road; the Todo
  # is persisted through POST /todos.

  Background:
    Given the Road Overview map is loaded

  Scenario: Add a new Todo to a road that has no measure yet
    When Tester clicks on the road without an existing Todo
    And Tester fills in the Todo form with description "Surface cracks near the junction", status "open" and author "qa.e2e@serenity.test"
    Then the backend stores a Todo for that road authored by "qa.e2e@serenity.test"
    And the Todos overview page lists a Todo authored by "qa.e2e@serenity.test"

  @defect
  Scenario: [DEFECT] The create action is mislabeled "Update" for a road without a Todo
    # Requirement 7 distinguishes adding a NEW Todo from updating an existing one.
    # Expected: the primary button reads "Save" when creating. Actual: "Update".
    When Tester clicks on the road without an existing Todo
    Then the Todo form action button should read "Save"

  @defect
  Scenario: [DEFECT] The title cannot be entered when creating a Todo
    # Requirement 7 lists "Titel" as a Todo input field. Actual: the Title field
    # is pre-filled with the road name and disabled, so no title can be entered.
    When Tester clicks on the road without an existing Todo
    Then the Todo title field should be editable
