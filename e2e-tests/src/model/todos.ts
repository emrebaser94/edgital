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
