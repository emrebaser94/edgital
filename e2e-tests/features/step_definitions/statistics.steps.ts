import { Given, Then, When } from '@cucumber/cucumber';
import { Actor } from '@serenity-js/core';
import { Ensure, equals, isCloseTo, not } from '@serenity-js/assertions';
import { isVisible } from '@serenity-js/web';

import {
  AverageGwGrade,
  BarValue,
  ChartedEvaluations,
  StatisticsMetricValue,
} from '../../src/screenplay/questions';
import { FetchRoads, OpenStatisticsPage, ToggleChartSeries } from '../../src/screenplay/tasks';
import { StatisticsPage } from '../../src/screenplay/ui';

/** GW, TWGEB, TWOFS, TWRIO, TWSUB and TWEBEN are charted. */
const CHARTED_EVALUATIONS = 6;

Given('{actor} has opened the Statistics page', (actor: Actor) =>
  actor.attemptsTo(
    OpenStatisticsPage(),
  ));

When('{pronoun} hides the {string} bars', (actor: Actor, metric: string) =>
  actor.attemptsTo(
    ToggleChartSeries(metric),
  ));

When('{pronoun} shows the {string} bars again', (actor: Actor, metric: string) =>
  actor.attemptsTo(
    ToggleChartSeries(metric),
  ));

Then('{pronoun} should see the statistics chart', (actor: Actor) =>
  actor.attemptsTo(
    Ensure.that(StatisticsPage.chart(), isVisible()),
  ));

Then('{pronoun} should see {int} total roads in the statistics table', (actor: Actor, total: number) =>
  actor.attemptsTo(
    Ensure.that(StatisticsMetricValue('Total Roads'), equals(String(total))),
  ));

Then('{pronoun} should see an average GW value in the statistics table', (actor: Actor) =>
  actor.attemptsTo(
    Ensure.that(StatisticsMetricValue('Average GW'), not(equals(''))),
  ));

Then('{pronoun} should see an Average GW matching the value computed from the roads endpoint', (actor: Actor) =>
  actor.attemptsTo(
    FetchRoads(),
    Ensure.that(
      StatisticsMetricValue('Average GW').as((text: string) => Number.parseFloat(text)),
      isCloseTo(AverageGwGrade(), 0.0001),
    ),
  ));

Then('{pronoun} should see total and average bars for the evaluations {string}', (actor: Actor, evaluations: string) => {
  const expected = evaluations.split(',').map((evaluation) => evaluation.trim());
  return actor.attemptsTo(
    Ensure.that(ChartedEvaluations('total'), equals(expected)),
    Ensure.that(ChartedEvaluations('average'), equals(expected)),
  );
});

Then('{pronoun} should see a {string} average bar matching the value computed from the roads endpoint', (actor: Actor, evaluation: string) =>
  actor.attemptsTo(
    FetchRoads(),
    Ensure.that(BarValue(evaluation, 'average'), isCloseTo(AverageGwGrade(), 0.0001)),
  ));

Then('{pronoun} should see only the {string} bars', (actor: Actor, metric: string) => {
  const hidden = metric === 'total' ? 'average' : 'total';
  return actor.attemptsTo(
    Ensure.that(StatisticsPage.bars(metric).count(), equals(CHARTED_EVALUATIONS)),
    Ensure.that(StatisticsPage.bars(hidden).count(), equals(0)),
  );
});
