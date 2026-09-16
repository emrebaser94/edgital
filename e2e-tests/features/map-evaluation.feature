@map @TF-1
Feature: Assess road condition on the map by evaluation type
  As a user
  I want to pick an evaluation and see roads coloured by their grade
  So that I can judge the road condition at a glance

  # Traceability: Requirement 3 (colour roads by eemi grade, selectable
  # evaluation GW/TWRIO/RISS/…) and Requirement 4 (legend).

  Background:
    Given Paul has opened the Road Overview map

  @req-4
  Scenario: The legend lists all five grade buckets
    Then he should see these grade ranges in the map legend:
      | Grade 1 - 1.49   |
      | Grade 1.5 - 2.49 |
      | Grade 2.5 - 3.49 |
      | Grade 3.5 - 4.49 |
      | Grade 4.5 - 5.00 |

  @req-3
  Scenario Outline: Roads are coloured with the grade palette for the "<evaluation>" evaluation
    When he selects the "<evaluation>" evaluation
    Then he should see every visible road coloured with a grade-palette colour

    Examples:
      | evaluation |
      | GW         |
      | TWRIO      |
