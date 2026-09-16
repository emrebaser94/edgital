import { By, PageElement, PageElements } from '@serenity-js/web';

export class StatisticsPage {
  static chart = () =>
    PageElement.located(By.css('svg#statisticsChart')).describedAs('the statistics chart');

  static metricRow = (label: string) =>
    PageElement.located(By.cssContainingText('tr', label)).describedAs(`the "${label}" row`);

  static metricValue = (label: string) =>
    PageElement.located(By.css('td:last-child')).of(StatisticsPage.metricRow(label))
      .describedAs(`the "${label}" value`);

  /** Every bar of one metric ("total" or "average"), in chart order. */
  static bars = (metric: string) =>
    PageElements.located(By.css(`svg#statisticsChart rect.bar[data-metric="${metric}"]`))
      .describedAs(`the ${metric} bars`);

  static bar = (series: string, metric: string) =>
    PageElement.located(By.css(`svg#statisticsChart rect.bar[data-series="${series}"][data-metric="${metric}"]`))
      .describedAs(`the ${metric} bar of "${series}"`);
}
