export interface Todo {
  id: number | string;
  title?: string;
  description?: string;
  status?: string;
  author?: string;
  road_fid: number;
}

export interface TodoFormData {
  description: string;
  status: string;
  author: string;
}

export interface NewTodoFormData extends TodoFormData {
  title: string;
}

/** Author used by every Todo this suite creates — the cleanup hooks delete by it. */
export const TEST_TODO_AUTHOR = 'qa.e2e@serenity.test';
