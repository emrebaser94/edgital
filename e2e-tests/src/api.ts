import { config } from './config';

interface Todo {
  id: number | string;
  title?: string;
  description?: string;
  status?: string;
  author?: string;
  road_fid: number;
}

/** Small REST helper used by Cucumber hooks (for cleanup) and by the
 *  "compare UI against API" scenario. Uses Node's global fetch. */
export const api = {
  async todosForRoad(fid: number): Promise<Todo[]> {
    const res = await fetch(`${config.apiURL}/todos?road_fid=${fid}`);
    if (!res.ok) throw new Error(`GET /todos?road_fid=${fid} -> ${res.status}`);
    return res.json();
  },

  async deleteTodo(id: number | string): Promise<void> {
    await fetch(`${config.apiURL}/todos/${id}`, { method: 'DELETE' });
  },

  /** Remove every Todo attached to a road — keeps the suite idempotent. */
  async deleteTodosForRoad(fid: number): Promise<void> {
    const todos = await this.todosForRoad(fid);
    await Promise.all(todos.map((t) => this.deleteTodo(t.id)));
  },

  /** Average `gw` grade over all roads, computed exactly as the SUT does. */
  async averageGw(): Promise<number> {
    const res = await fetch(`${config.apiURL}/roads`);
    const data = await res.json();
    const values: number[] = data.features.map((f: any) => f.properties.eemi_grade.gw);
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  },
};

/** The road we exercise for the "add Todo" flow: map index 1 == road fid 1307,
 *  which ships without a seed Todo, so clicking it creates a fresh one. */
export const ROAD_WITHOUT_TODO = { mapIndex: 1, fid: 1307 } as const;
