import { Duration, Task, Wait } from '@serenity-js/core';
import { Click, isVisible } from '@serenity-js/web';

import { RoadMap } from '../ui/RoadMap';
import { TodoModal } from '../ui/TodoModal';

/** Click a road on the map and wait until the Todo form (modal) is open. */
export const OpenTodoFormForRoad = (index: number) =>
  Task.where(`#actor opens the Todo form for road #${index}`,
    Click.on(RoadMap.road(index)),
    Wait.upTo(Duration.ofSeconds(10)).until(TodoModal.heading(), isVisible()),
  );
