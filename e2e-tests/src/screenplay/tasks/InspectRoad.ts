import { Duration, Task, Wait } from '@serenity-js/core';
import { isPresent } from '@serenity-js/assertions';
import { Hover } from '@serenity-js/web';

import { RoadMap } from '../ui/RoadMap';

/**
 * Hover a road and wait until its tooltip is shown.
 *
 * The tooltip is awaited with isPresent(), not isVisible(): Leaflet styles it
 * with `pointer-events: none`, and Serenity's isVisible() hit-tests the element
 * centre via document.elementFromPoint — which then returns the map container,
 * so the tooltip would never count as visible. Leaflet adds the tooltip to the
 * DOM when it opens and removes it on mouseout, so presence == shown.
 */
export const InspectRoad = (index: number) =>
  Task.where(`#actor hovers over road #${index} to see its details`,
    Hover.over(RoadMap.road(index)),
    Wait.upTo(Duration.ofSeconds(5)).until(RoadMap.tooltip(), isPresent()),
  );
