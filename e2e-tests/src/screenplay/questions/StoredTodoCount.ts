import { Question } from '@serenity-js/core';
import { LastResponse } from '@serenity-js/rest';

import { Todo } from '../../model';

/** How many Todos the last `/todos` response holds. */
export const StoredTodoCount = () =>
  Question.about<Promise<number>>('the number of stored Todos', async (actor) => {
    const todos = await actor.answer(LastResponse.body<Todo[]>());
    return todos.length;
  });
