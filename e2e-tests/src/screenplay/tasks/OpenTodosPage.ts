import { Task } from '@serenity-js/core';
import { Navigate } from '@serenity-js/web';

export const OpenTodosPage = () =>
  Task.where('#actor opens the Todos overview page',
    Navigate.to('/todos'),
  );
