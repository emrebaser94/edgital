import { By, PageElement } from '@serenity-js/web';

export class TodoModal {
  static heading = () =>
    PageElement.located(By.css('.modal-content h2')).describedAs('the Todo modal heading');

  static titleField = () =>
    PageElement.located(By.css('input[placeholder="Title"]')).describedAs('the Title field');

  static descriptionField = () =>
    PageElement.located(By.css('textarea[placeholder="Description"]')).describedAs('the Description field');

  static statusField = () =>
    PageElement.located(By.css('input[placeholder="Status"]')).describedAs('the Status field');

  static authorField = () =>
    PageElement.located(By.css('input[placeholder="Author"]')).describedAs('the Author field');

  static roadFidField = () =>
    PageElement.located(By.css('input[placeholder="Road Fid"]')).describedAs('the Road Fid field');

  /** The primary action button (the "Save"/"Update" button, not "Close"). */
  static actionButton = () =>
    PageElement.located(By.css('.modal-footer button:last-child')).describedAs('the Todo action button');
}
