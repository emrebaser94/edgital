import { Question } from '@serenity-js/core';
import { LastResponse } from '@serenity-js/rest';

import { RoadProperties } from '../../model';

/** The properties of one road (fid, name, evnk, ennk, eemi_grade).
 *  Reads the last `/roads` response, so send `GetRequest.to('/roads')` first. */
export const PropertiesOfRoad = (fid: number) =>
  Question.about<Promise<RoadProperties>>(`the properties of road ${fid}`, async (actor) => {
    const data = await actor.answer(LastResponse.body<{ features: { properties: RoadProperties }[] }>());
    return data.features.find((f) => f.properties.fid === fid).properties;
  });
