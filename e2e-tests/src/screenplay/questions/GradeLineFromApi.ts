import { PropertiesOfRoad } from './PropertiesOfRoad';

/** The tooltip grade line a road should show, e.g. "EEMI Grade (twofs): 3.3".
 *  Reads the last `/roads` response, so perform `FetchRoads` first. */
export const GradeLineFromApi = (fid: number, evaluation: string) =>
  PropertiesOfRoad(fid)
    .as((road) => `EEMI Grade (${evaluation}): ${road.eemi_grade[evaluation]}`)
    .describedAs(`the "${evaluation}" grade line of road ${fid} according to the API`);
