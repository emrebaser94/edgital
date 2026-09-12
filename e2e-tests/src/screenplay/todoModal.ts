import { Task } from '@serenity-js/core';
import { Attribute, By, Clear, Enter, Click, PageElement, Text } from '@serenity-js/web';

export interface TodoFormData {
  description: string;
  status: string;
  author: string;
}

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

  /** Whether the Title field is editable (i.e. NOT disabled). */
  static titleIsEditable = () =>
    Attribute.called('disabled').of(TodoModal.titleField()).as((value) => value === null);

  static actionButtonLabel = () => Text.of(TodoModal.actionButton());
}

/**
 * Fill in the editable Todo fields and save. The Title field is intentionally
 * left untouched: the SUT pre-fills it with the road name and disables it.
 */
export const fillAndSaveTodo = (data: TodoFormData) =>
  Task.where('#actor fills in and saves the Todo form',
    Enter.theValue(data.description).into(TodoModal.descriptionField()),
    Enter.theValue(data.status).into(TodoModal.statusField()),
    Enter.theValue(data.author).into(TodoModal.authorField()),
    Click.on(TodoModal.actionButton()),
  );

export { Clear };
