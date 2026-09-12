import { DataTable, Then, When } from '@cucumber/cucumber';
import { actorCalled } from '@serenity-js/core';
import { contain, Ensure, equals, includes } from '@serenity-js/assertions';

import { evaluationOptionLabels, legendText, RoadMap, roadColoursOutsidePalette } from '../../src/screenplay/map';

When('Tester selects the {string} evaluation', (evaluation: string) =>
  actorCalled('Tester').attemptsTo(
    RoadMap.selectEvaluation(evaluation),
  ));

Then('the map legend shows the grade ranges:', (table: DataTable) => {
  const ranges = table.raw().map((row) => row[0]);
  return actorCalled('Tester').attemptsTo(
    ...ranges.map((range) => Ensure.that(legendText(), includes(range))),
  );
});

Then('every visible road is coloured using a grade-palette colour', () =>
  actorCalled('Tester').attemptsTo(
    // roadColoursOutsidePalette returns the offending colours — expect none.
    Ensure.that(roadColoursOutsidePalette(60), equals([])),
  ));

Then('the evaluation dropdown offers the option {string}', (option: string) =>
  actorCalled('Tester').attemptsTo(
    Ensure.that(evaluationOptionLabels(), contain(option)),
  ));
