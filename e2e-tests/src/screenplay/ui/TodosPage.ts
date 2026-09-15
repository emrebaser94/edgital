import { By, PageElement } from '@serenity-js/web';

export class TodosPage {
  static cellContaining = (text: string) =>
    PageElement.located(By.cssContainingText('td', text)).describedAs(`Todos cell "${text}"`);
}
