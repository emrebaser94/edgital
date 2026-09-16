import { Task } from '@serenity-js/core';
import { Clear, Click, Enter } from '@serenity-js/web';

import { NewTodoFormData } from '../../model';
import { TodoModal } from '../ui/TodoModal';

/** Fill in every field of a new Todo — including the title, which the form
 *  pre-fills with the road name — and save it. */
export const FillAndSaveNewTodo = (data: NewTodoFormData) =>
  Task.where('#actor fills in and saves a new Todo',
    Clear.theValueOf(TodoModal.titleField()),
    Enter.theValue(data.title).into(TodoModal.titleField()),
    Enter.theValue(data.description).into(TodoModal.descriptionField()),
    Enter.theValue(data.status).into(TodoModal.statusField()),
    Enter.theValue(data.author).into(TodoModal.authorField()),
    Click.on(TodoModal.actionButton()),
  );
