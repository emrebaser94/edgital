import { DataTable, Then, When } from '@cucumber/cucumber';
import { Actor } from '@serenity-js/core';
import { contain, Ensure, equals, includes } from '@serenity-js/assertions';

import { ROAD_FOR_COLOURING } from '../../src/model';
import { EvaluationOptionLabels, GradeColourFromApi, LegendText, RoadStrokeColour } from '../../src/screenplay/questions';
import { FetchRoads, SelectEvaluation } from '../../src/screenplay/tasks';

When('{pronoun} selects the {string} evaluation', (actor: Actor, evaluation: string) =>
  actor.attemptsTo(
    SelectEvaluation(evaluation),
  ));

Then('{pronoun} should see these grade ranges in the map legend:', (actor: Actor, table: DataTable) => {
  const ranges = table.raw().map((row) => row[0]);
  return actor.attemptsTo(
    ...ranges.map((range) => Ensure.that(LegendText(), includes(range))),
  );
});

Then('{pronoun} should see the reference road coloured by its {string} grade', (actor: Actor, evaluation: string) =>
  actor.attemptsTo(
    FetchRoads(),
    Ensure.that(
      RoadStrokeColour(ROAD_FOR_COLOURING.mapIndex),
      // The dropdown shows "TWOFS", the API key is "twofs".
      equals(GradeColourFromApi(ROAD_FOR_COLOURING.fid, evaluation.toLowerCase())),
    ),
  ));

Then('{pronoun} should be able to pick the {string} evaluation', (actor: Actor, option: string) =>
  actor.attemptsTo(
    Ensure.that(EvaluationOptionLabels(), contain(option)),
  ));
