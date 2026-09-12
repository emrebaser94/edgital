import { Given, Then } from '@cucumber/cucumber';
import { actorCalled } from '@serenity-js/core';
import { Ensure, equals, isCloseTo, not } from '@serenity-js/assertions';
import { isVisible } from '@serenity-js/web';

import { StatisticsPage } from '../../src/screenplay/pages';
import { api } from '../../src/api';

Given('Tester is on the Statistics page', () =>
  actorCalled('Tester').attemptsTo(
    StatisticsPage.open(),
  ));

Then('the statistics chart is displayed', () =>
  actorCalled('Tester').attemptsTo(
    Ensure.that(StatisticsPage.chart(), isVisible()),
  ));

Then('the statistics table reports 773 total roads', () =>
  actorCalled('Tester').attemptsTo(
    Ensure.that(StatisticsPage.metricValueText('Total Roads'), equals('773')),
  ));

Then('the statistics table reports an average GW value', () =>
  actorCalled('Tester').attemptsTo(
    Ensure.that(StatisticsPage.metricValueText('Average GW'), not(equals(''))),
  ));

Then('the displayed Average GW matches the value computed from the roads endpoint', async () => {
  const expected = await api.averageGw();
  return actorCalled('Tester').attemptsTo(
    Ensure.that(
      StatisticsPage.metricValueText('Average GW').as((text: string) => Number.parseFloat(text)),
      isCloseTo(expected, 0.0001),
    ),
  );
});
