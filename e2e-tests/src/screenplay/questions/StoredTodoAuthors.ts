import { Question } from '@serenity-js/core';
import { LastResponse } from '@serenity-js/rest';

import { Todo } from '../../model';

/** The authors of the Todos in the last `/todos` response. */
export const StoredTodoAuthors = () =>
  Question.about<Promise<string[]>>('the authors of the stored Todos', async (actor) => {
    const todos = await actor.answer(LastResponse.body<Todo[]>());
    return todos.map((t) => t.author ?? '');
  });
