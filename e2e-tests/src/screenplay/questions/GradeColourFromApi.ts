import { colourForGrade } from '../../model';
import { PropertiesOfRoad } from './PropertiesOfRoad';

/** The palette colour a road should have for an evaluation, derived from its
 *  API grade. Reads the last `/roads` response, so perform `FetchRoads` first. */
export const GradeColourFromApi = (fid: number, evaluation: string) =>
  PropertiesOfRoad(fid)
    .as((road) => colourForGrade(road.eemi_grade[evaluation]))
    .describedAs(`the "${evaluation}" grade colour of road ${fid} according to the API`);
