import { PropertiesOfRoad } from './PropertiesOfRoad';

/** The tooltip text a road should show for an evaluation, built from the API
 *  data. Reads the last `/roads` response, so perform `FetchRoads` first. */
export const TooltipTextFromApi = (fid: number, evaluation: string) =>
  PropertiesOfRoad(fid)
    .as((road) =>
      `Road ID: ${road.fid} Name: ${road.name ?? '-'} EVNK: ${road.evnk} ENNK: ${road.ennk} ` +
      `EEMI Grade (${evaluation}): ${road.eemi_grade[evaluation]}`)
    .describedAs(`the "${evaluation}" tooltip text of road ${fid} according to the API`);
