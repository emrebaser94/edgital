import { Attribute } from '@serenity-js/web';

import { StatisticsPage } from '../ui/StatisticsPage';

/** The evaluations charted as bars of one metric, e.g. ["GW", "TWGEB", …]. */
export const ChartedEvaluations = (metric: string) =>
  StatisticsPage.bars(metric)
    .eachMappedTo(Attribute.called('data-series'))
    .as((series) => series.map((value) => String(value).toUpperCase()))
    .describedAs(`the evaluations charted as ${metric} bars`);
