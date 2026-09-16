import { Task } from '@serenity-js/core';
import { Click } from '@serenity-js/web';

import { StatisticsPage } from '../ui/StatisticsPage';

/** Click a legend entry of the statistics chart to hide or show that metric's bars. */
export const ToggleChartSeries = (metric: string) =>
  Task.where(`#actor toggles the ${metric} bars via the chart legend`,
    Click.on(StatisticsPage.legendItem(metric)),
  );
