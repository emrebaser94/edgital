import { ComputedStyle } from '@serenity-js/web';

import { RoadMap } from '../ui/RoadMap';

/** The stroke colour the browser computes for one road, e.g. "rgb(0, 100, 0)". */
export const RoadStrokeColour = (index: number) =>
  ComputedStyle.called('stroke').of(RoadMap.road(index)).describedAs(`the colour of road #${index}`);
