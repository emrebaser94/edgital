import { By, PageElement } from '@serenity-js/web';

export class NavigationBar {
  static link = (name: string) =>
    PageElement.located(By.cssContainingText('.header li', name)).describedAs(`the "${name}" menu link`);
}
