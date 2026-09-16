import { By, PageElement, PageElements } from '@serenity-js/web';

export class StatisticsPage {
  static chart = () =>
    PageElement.located(By.css('canvas#statisticsChart')).describedAs('the statistics chart');

  static metricRow = (label: string) =>
    PageElement.located(By.cssContainingText('tr', label)).describedAs(`the "${label}" row`);

  static metricValue = (label: string) =>
    PageElement.located(By.css('td:last-child')).of(StatisticsPage.metricRow(label))
      .describedAs(`the "${label}" value`);

  /** The chart values as text — a canvas holds no elements to assert on. */
  static chartDataLabels = () =>
    PageElements.located(By.css('table.chart-data tbody .series-label')).describedAs('the charted evaluations');

  static chartDataRow = (series: string) =>
    PageElement.located(By.css(`table.chart-data tbody tr[data-series="${series}"]`))
      .describedAs(`the "${series}" chart row`);

  static chartAverage = (series: string) =>
    PageElement.located(By.css('.series-average')).of(StatisticsPage.chartDataRow(series))
      .describedAs(`the charted average of "${series}"`);
}
