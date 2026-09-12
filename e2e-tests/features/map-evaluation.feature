Feature: Assess road condition on the map by evaluation type
  As a user
  I want to pick an evaluation and see roads coloured by their grade
  So that I can judge the road condition at a glance

  # Traceability: Requirement 3 (colour roads by eemi grade, selectable
  # evaluation GW/TWRIO/RISS/…) and Requirement 4 (legend).

  Background:
    Given the Road Overview map is loaded

  Scenario: The legend lists all five grade buckets
    Then the map legend shows the grade ranges:
      | Grade 1 - 1.49   |
      | Grade 1.5 - 2.49 |
      | Grade 2.5 - 3.49 |
      | Grade 3.5 - 4.49 |
      | Grade 4.5 - 5.00 |

  Scenario Outline: Roads are coloured with the grade palette for the "<evaluation>" evaluation
    When Tester selects the "<evaluation>" evaluation
    Then every visible road is coloured using a grade-palette colour

    Examples:
      | evaluation |
      | GW         |
      | TWRIO      |

  @defect
  Scenario: [DEFECT] The RISS evaluation is not selectable although the data exists
    # Requirement 3 explicitly names RISS as a selectable evaluation, and the
    # value exists under eemi_grade.sub_type_grades.RISS — but the dropdown
    # only offers GW/TWGEB/TWOFS/TWRIO/TWSUB/TWEBEN.
    Then the evaluation dropdown offers the option "RISS"
