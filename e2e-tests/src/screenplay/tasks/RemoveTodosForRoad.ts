import { List, Task } from '@serenity-js/core';
import { DeleteRequest, GetRequest, LastResponse, Send } from '@serenity-js/rest';

import { Todo } from '../../model';

/** Remove every Todo attached to a road — keeps the suite idempotent.
 *  Each DELETE is its own activity, so the report shows what was cleaned up. */
export const RemoveTodosForRoad = (fid: number) =>
  Task.where(`#actor removes every Todo stored for road ${fid}`,
    Send.a(GetRequest.to(`/todos?road_fid=${fid}`)),
    List.of(LastResponse.body<Todo[]>()).forEach(({ actor, item }) =>
      actor.attemptsTo(
        Send.a(DeleteRequest.to(`/todos/${item.id}`)),
      )),
  );
