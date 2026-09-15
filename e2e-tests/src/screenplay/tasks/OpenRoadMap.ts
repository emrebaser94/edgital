import { Duration, Task, Wait } from '@serenity-js/core';
import { isVisible, Navigate } from '@serenity-js/web';

import { RoadMap } from '../ui/RoadMap';

/** Load the map page and wait until the road geometry has rendered. */
export const OpenRoadMap = () =>
  Task.where('#actor opens the Road Overview map',
    Navigate.to('/'),
    Wait.upTo(Duration.ofSeconds(20)).until(RoadMap.roads().first(), isVisible()),
  );
