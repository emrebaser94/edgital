import { Text } from '@serenity-js/web';

import { TodoModal } from '../ui/TodoModal';

/** The pager text in the Todo form, e.g. "1 / 2". */
export const TodoCounterText = () => Text.of(TodoModal.todoCounter());
