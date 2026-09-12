import { Interaction, Question, Task } from '@serenity-js/core';
import { DeleteRequest, GetRequest, LastResponse, Send } from '@serenity-js/rest';

export interface Todo {
  id: number | string;
  title?: string;
  description?: string;
  status?: string;
  author?: string;
  road_fid: number;
}

/** The road we exercise for the "add Todo" flow: map index 1 == road fid 1307,
 *  which ships without a seed Todo, so clicking it creates a fresh one. */
export const ROAD_WITHOUT_TODO = { mapIndex: 1, fid: 1307 } as const;

/**
 * Screenplay API interactions/questions built on the actor's `CallAnApi`
 * ability (see src/Actors.ts). They let us verify that a UI action actually
 * reached the backend and keep the suite idempotent — without bypassing
 * Serenity/JS with raw `fetch`.
 */

/** Fetch the Todos stored against a road (populates `LastResponse`). */
export const TodosForRoad = (fid: number) =>
  Task.where(`#actor fetches the Todos stored for road ${fid}`,
    Send.a(GetRequest.to(`/todos?road_fid=${fid}`)),
  );

/** The authors of the Todos in the last `/todos` response. */
export const StoredTodoAuthors = () =>
  Question.about<Promise<string[]>>('the authors of the stored Todos', async (actor) => {
    const todos = await actor.answer(LastResponse.body<Todo[]>());
    return todos.map((t) => t.author ?? '');
  });

/** Remove every Todo attached to a road — keeps the suite idempotent. */
export const RemoveTodosForRoad = (fid: number) =>
  Interaction.where(`#actor removes every Todo stored for road ${fid}`, async (actor) => {
    await Send.a(GetRequest.to(`/todos?road_fid=${fid}`)).performAs(actor);
    const todos = await LastResponse.body<Todo[]>().answeredBy(actor);
    for (const todo of todos) {
      await Send.a(DeleteRequest.to(`/todos/${todo.id}`)).performAs(actor);
    }
  });

/** Average `gw` grade over all roads, computed exactly as the SUT does.
 *  Reads the last `/roads` response, so send `GetRequest.to('/roads')` first. */
export const AverageGwGrade = () =>
  Question.about<Promise<number>>('the average gw grade computed from /roads', async (actor) => {
    const data = await actor.answer(LastResponse.body<{ features: any[] }>());
    const values: number[] = data.features.map((f) => f.properties.eemi_grade.gw);
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  });
