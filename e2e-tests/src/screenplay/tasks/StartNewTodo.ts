import { Task } from '@serenity-js/core';
import { Click } from '@serenity-js/web';

import { TodoModal } from '../ui/TodoModal';

/** Start a further Todo for a road that already has one. */
export const StartNewTodo = () =>
  Task.where('#actor starts a new Todo',
    Click.on(TodoModal.newTodoButton()),
  );
