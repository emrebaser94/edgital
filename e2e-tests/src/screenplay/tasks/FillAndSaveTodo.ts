import { Task } from '@serenity-js/core';
import { Click, Enter } from '@serenity-js/web';

import { TodoFormData } from '../../model';
import { TodoModal } from '../ui/TodoModal';

/**
 * Fill in the editable Todo fields and save. The Title field is intentionally
 * left untouched: the SUT pre-fills it with the road name and disables it.
 */
export const FillAndSaveTodo = (data: TodoFormData) =>
  Task.where('#actor fills in and saves the Todo form',
    Enter.theValue(data.description).into(TodoModal.descriptionField()),
    Enter.theValue(data.status).into(TodoModal.statusField()),
    Enter.theValue(data.author).into(TodoModal.authorField()),
    Click.on(TodoModal.actionButton()),
  );
