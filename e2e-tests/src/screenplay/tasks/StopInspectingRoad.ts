import { Duration, Task, Wait } from '@serenity-js/core';
import { isPresent, not } from '@serenity-js/assertions';
import { Hover } from '@serenity-js/web';

import { RoadMap } from '../ui/RoadMap';

/** Move the mouse off the road (onto the legend below the map) and wait until
 *  the tooltip is gone — this is what triggers Leaflet's `mouseout`. */
export const StopInspectingRoad = () =>
  Task.where('#actor moves the mouse away from the road',
    Hover.over(RoadMap.legend()),
    Wait.upTo(Duration.ofSeconds(5)).until(RoadMap.tooltip(), not(isPresent())),
  );
