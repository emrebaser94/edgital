import { Attribute } from '@serenity-js/web';

import { TodoModal } from '../ui/TodoModal';

/** Whether the Title field is editable (i.e. NOT disabled). */
export const TodoTitleIsEditable = () =>
  Attribute.called('disabled').of(TodoModal.titleField()).as((value) => value === null);
