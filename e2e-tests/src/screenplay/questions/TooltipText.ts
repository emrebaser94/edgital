import { Text } from '@serenity-js/web';

import { RoadMap } from '../ui/RoadMap';

/** The tooltip text with line breaks collapsed, e.g.
 *  "Road ID: 1317 Name: - EVNK: … ENNK: … EEMI Grade (gw): 1.79". */
export const TooltipText = () =>
  Text.of(RoadMap.tooltip())
    .as((text: string) => text.replace(/\s+/g, ' ').trim())
    .describedAs('the road tooltip text');
