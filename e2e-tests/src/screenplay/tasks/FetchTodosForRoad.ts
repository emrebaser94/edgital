import { Task } from '@serenity-js/core';
import { GetRequest, Send } from '@serenity-js/rest';

/** Fetch the Todos stored against a road (populates `LastResponse`). */
export const FetchTodosForRoad = (fid: number) =>
  Task.where(`#actor fetches the Todos stored for road ${fid}`,
    Send.a(GetRequest.to(`/todos?road_fid=${fid}`)),
  );
