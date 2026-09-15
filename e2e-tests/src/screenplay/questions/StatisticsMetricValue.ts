import { Text } from '@serenity-js/web';

import { StatisticsPage } from '../ui/StatisticsPage';

/** The displayed value of a statistics table row, e.g. "Total Roads" → "773". */
export const StatisticsMetricValue = (label: string) => Text.of(StatisticsPage.metricValue(label));
