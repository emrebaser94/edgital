import { Task } from '@serenity-js/core';
import { Click } from '@serenity-js/web';

import { TodoModal } from '../ui/TodoModal';

export const PageToNextTodo = () =>
  Task.where('#actor pages to the next Todo',
    Click.on(TodoModal.nextTodoButton()),
  );
