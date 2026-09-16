import { Question } from '@serenity-js/core';
import { Text } from '@serenity-js/web';

import { StatisticsPage } from '../ui/StatisticsPage';

/** The evaluations the chart shows, e.g. ["GW", "TWGEB", …]. */
export const ChartedEvaluations = (): Question<Promise<string[]>> =>
  Text.ofAll(StatisticsPage.chartDataLabels());
