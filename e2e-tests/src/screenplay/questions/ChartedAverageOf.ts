import { Attribute } from '@serenity-js/web';

import { StatisticsPage } from '../ui/StatisticsPage';

/** The charted average of one evaluation, read at full precision from `data-value`
 *  (the cell itself shows it rounded to two decimals). */
export const ChartedAverageOf = (series: string) =>
  Attribute.called('data-value').of(StatisticsPage.chartAverage(series))
    .as(Number)
    .describedAs(`the charted average of "${series}"`);
