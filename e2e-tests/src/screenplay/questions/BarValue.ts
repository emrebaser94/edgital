import { Attribute } from '@serenity-js/web';

import { StatisticsPage } from '../ui/StatisticsPage';

/** The value one bar represents, read from its `data-value` attribute. */
export const BarValue = (series: string, metric: string) =>
  Attribute.called('data-value').of(StatisticsPage.bar(series, metric))
    .as(Number)
    .describedAs(`the value of the ${metric} bar of "${series}"`);
