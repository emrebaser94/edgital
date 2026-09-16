@map @req-5 @TF-1
Feature: Inspect road details by hovering over the map
  As a road maintenance planner
  I want to see a road's attributes and grade when I hover over it
  So that I can check a road's condition without leaving the map

  # Traceability: Requirement 5 (hover effects: highlight the road and show
  # attributes and coarse-grained evaluations in a tooltip).

  Background:
    Given Paul has opened the Road Overview map

  Scenario: Hovering a road shows its attributes and grade
    When he hovers over a road
    Then he should see the attributes and the "gw" grade of that road in the tooltip

  @defect @issue:BUG-01
  Scenario: [DEFECT] The hover tooltip ignores the selected evaluation
    # Expected: "EEMI Grade (twofs): <twofs grade>". Actual: "EEMI Grade (gw): …",
    # i.e. always the evaluation active on page load. <GeoJSON> has no
    # key={evaluation}, so the onEachFeature closure is the one from the first render.
    When he selects the "TWOFS" evaluation
    And he hovers over a road
    Then he should see the "twofs" grade of that road in the tooltip

  @defect @req-3
  Scenario: [DEFECT] A hovered road loses the colour of the selected evaluation
    # Same stale closure as BUG-01: mouseout resets the stroke with the getStyle()
    # of the first render, so the road is recoloured by its GW grade although
    # TWOFS is selected — the map ends up mixing two evaluations.
    When he selects the "TWOFS" evaluation
    And he hovers over a road and moves the mouse away
    Then he should see that road coloured by its "twofs" grade
