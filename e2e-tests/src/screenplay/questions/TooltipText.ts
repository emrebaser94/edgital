import { Text } from '@serenity-js/web';

import { RoadMap } from '../ui/RoadMap';

/** The tooltip text of one road with line breaks collapsed, e.g.
 *  "Road ID: 1317 Name: - EVNK: … ENNK: … EEMI Grade (gw): 1.79". */
export const TooltipText = (fid: number) =>
  Text.of(RoadMap.tooltipOf(fid))
    .as((text: string) => text.replace(/\s+/g, ' ').trim())
    .describedAs(`the tooltip text of road ${fid}`);
