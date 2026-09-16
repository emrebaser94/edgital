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

  @defect
  Scenario: [DEFECT] Every Todo of a road with several Todos can be opened
    # Requirement 7 covers updating existing Todos. Road 1306 carries two of them
    # (ids 2 and 7), but clicking the road always opens the first one and the form
    # offers no way to reach the second.
    When he clicks on a road that has several Todos
    Then he should see Todo 1 of 2 in the Todo form
    When he pages to the next Todo
    Then he should see Todo 2 of 2 in the Todo form
    And he should see the Todo titled "Instandsetzung 3 - 08.09.2026"

  @defect
  Scenario: [DEFECT] A further Todo can be added to a road that already has one
    # Requirement 7 also covers adding a Todo. For a road that already has one the
    # form only offers "Update", so a second measure cannot be recorded for it.
    When he clicks on a road that has several Todos
    Then he should be able to start a new Todo
    When he starts a new Todo and saves it with title "Zweite Maßnahme", description "Deckschicht erneuern", status "open" and author "qa.e2e@serenity.test"
    Then he should find 3 Todos stored for that road with several Todos
