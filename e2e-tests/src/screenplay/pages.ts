import { Duration, Task, Wait } from '@serenity-js/core';
import { By, Click, Navigate, PageElement, Text, isVisible } from '@serenity-js/web';

/** The whole page body — used for coarse "page shows X" text assertions. */
export const PageBody = () => PageElement.located(By.css('body')).describedAs('the page');

export class Menu {
  static link = (name: string) =>
    PageElement.located(By.cssContainingText('.header li', name)).describedAs(`the "${name}" menu link`);

  /** Click a navigation-bar entry. The <li> sits inside a react-router <Link>,
   *  so a plain click triggers client-side routing. */
  static open = (name: string) =>
    Task.where(`#actor opens "${name}" from the navigation bar`,
      Click.on(Menu.link(name)),
    );
}

export class StatisticsPage {
  static chart = () =>
    PageElement.located(By.css('canvas#statisticsChart')).describedAs('the statistics chart');

  static metricRow = (label: string) =>
    PageElement.located(By.cssContainingText('tr', label)).describedAs(`the "${label}" row`);

  static metricValue = (label: string) =>
    PageElement.located(By.css('td:last-child')).of(StatisticsPage.metricRow(label))
      .describedAs(`the "${label}" value`);

  static open = () =>
    Task.where('#actor opens the Statistics page',
      Navigate.to('/statistics'),
      Wait.upTo(Duration.ofSeconds(20)).until(StatisticsPage.chart(), isVisible()),
      Wait.upTo(Duration.ofSeconds(20)).until(StatisticsPage.metricRow('Total Roads'), isVisible()),
    );

  static metricValueText = (label: string) => Text.of(StatisticsPage.metricValue(label));
}
