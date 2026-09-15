import { Duration, Task, Wait } from '@serenity-js/core';
import { isVisible, Navigate } from '@serenity-js/web';

import { StatisticsPage } from '../ui/StatisticsPage';

export const OpenStatisticsPage = () =>
  Task.where('#actor opens the Statistics page',
    Navigate.to('/statistics'),
    Wait.upTo(Duration.ofSeconds(20)).until(StatisticsPage.chart(), isVisible()),
    Wait.upTo(Duration.ofSeconds(20)).until(StatisticsPage.metricRow('Total Roads'), isVisible()),
  );
