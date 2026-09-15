import { Given, Then } from '@cucumber/cucumber';
import { Actor } from '@serenity-js/core';
import { Ensure, equals, isCloseTo, not } from '@serenity-js/assertions';
import { isVisible } from '@serenity-js/web';

import { AverageGwGrade, StatisticsMetricValue } from '../../src/screenplay/questions';
import { FetchRoads, OpenStatisticsPage } from '../../src/screenplay/tasks';
import { StatisticsPage } from '../../src/screenplay/ui';

Given('{actor} has opened the Statistics page', (actor: Actor) =>
  actor.attemptsTo(
    OpenStatisticsPage(),
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
