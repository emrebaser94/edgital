@todos @req-7
Feature: Capture maintenance Todos from the map
  As a road maintenance planner
  I want to record a Todo for a road directly from the map
  So that measures are tracked against the correct road

  # Traceability: Requirement 7 (Abschnitt 4) — add a Todo (title, description,
  # status, author, road_fid) via a modal opened by clicking a road; the Todo
  # is persisted through POST /todos.

  Background:
    Given Paul has opened the Road Overview map

  Scenario: Add a new Todo to a road that has no measure yet
    When he clicks on a road that has no Todo yet
    And he saves a Todo with description "Surface cracks near the junction", status "open" and author "qa.e2e@serenity.test"
    Then he should find a Todo authored by "qa.e2e@serenity.test" stored for that road
    And he should see a Todo authored by "qa.e2e@serenity.test" on the Todos overview page

  @defect
  Scenario: [DEFECT] The create action is mislabeled "Update" for a road without a Todo
    # Requirement 7 distinguishes adding a NEW Todo from updating an existing one.
    # Expected: the primary button reads "Save" when creating. Actual: "Update".
    When he clicks on a road that has no Todo yet
    Then he should see the Todo form action button labelled "Save"

  @defect
  Scenario: [DEFECT] The title cannot be entered when creating a Todo
    # Requirement 7 lists "Titel" as a Todo input field. Actual: the Title field
    # is pre-filled with the road name and disabled, so no title can be entered.
    When he clicks on a road that has no Todo yet
    Then he should be able to edit the Todo title
