import { By, PageElement } from '@serenity-js/web';

export class StatisticsPage {
  static chart = () =>
    PageElement.located(By.css('canvas#statisticsChart')).describedAs('the statistics chart');

  static metricRow = (label: string) =>
    PageElement.located(By.cssContainingText('tr', label)).describedAs(`the "${label}" row`);

  static metricValue = (label: string) =>
    PageElement.located(By.css('td:last-child')).of(StatisticsPage.metricRow(label))
      .describedAs(`the "${label}" value`);
}
