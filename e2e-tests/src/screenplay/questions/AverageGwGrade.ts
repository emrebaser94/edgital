import { Question } from '@serenity-js/core';
import { LastResponse } from '@serenity-js/rest';

/** Average `gw` grade over all roads, computed exactly as the SUT does.
 *  Reads the last `/roads` response, so send `GetRequest.to('/roads')` first. */
export const AverageGwGrade = () =>
  Question.about<Promise<number>>('the average gw grade computed from /roads', async (actor) => {
    const data = await actor.answer(LastResponse.body<{ features: any[] }>());
    const values: number[] = data.features.map((f) => f.properties.eemi_grade.gw);
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  });
