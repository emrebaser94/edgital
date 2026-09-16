import { Value } from '@serenity-js/web';

import { TodoModal } from '../ui/TodoModal';

export const TodoTitleValue = () => Value.of(TodoModal.titleField());
