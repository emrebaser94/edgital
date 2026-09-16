import { List, Task } from '@serenity-js/core';
import { DeleteRequest, GetRequest, LastResponse, Send } from '@serenity-js/rest';

import { Todo } from '../../model';

/** Remove every Todo this suite created, wherever it was attached. */
export const RemoveTodosByAuthor = (author: string) =>
  Task.where(`#actor removes every Todo authored by ${author}`,
    Send.a(GetRequest.to(`/todos?author=${encodeURIComponent(author)}`)),
    List.of(LastResponse.body<Todo[]>()).forEach(({ actor, item }) =>
      actor.attemptsTo(
        Send.a(DeleteRequest.to(`/todos/${item.id}`)),
      )),
  );
