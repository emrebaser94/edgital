import { DataTable, Then, When } from '@cucumber/cucumber';
import { Actor } from '@serenity-js/core';
import { contain, Ensure, equals, includes } from '@serenity-js/assertions';

import { EvaluationOptionLabels, LegendText, RoadColoursOutsidePalette } from '../../src/screenplay/questions';
import { SelectEvaluation } from '../../src/screenplay/tasks';

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

Then('{pronoun} should see every visible road coloured with a grade-palette colour', (actor: Actor) =>
  actor.attemptsTo(
    // RoadColoursOutsidePalette returns the offending colours — expect none.
    Ensure.that(RoadColoursOutsidePalette(60), equals([])),
  ));

Then('{pronoun} should be able to pick the {string} evaluation', (actor: Actor, option: string) =>
  actor.attemptsTo(
    Ensure.that(EvaluationOptionLabels(), contain(option)),
  ));
