import { Question } from '@serenity-js/core';
import { ComputedStyle } from '@serenity-js/web';

import { GRADE_PALETTE } from '../../model';
import { RoadMap } from '../ui/RoadMap';

/**
 * The set of distinct stroke colours currently used by the first `limit`
 * roads that fall OUTSIDE the documented grade palette. Empty means every
 * sampled road is coloured correctly.
 */
export const RoadColoursOutsidePalette = (limit: number) =>
  Question.about<Promise<string[]>>(`road colours outside the grade palette (first ${limit})`, async (actor) => {
    const colours = await Promise.all(
      Array.from({ length: limit }, (_, index) =>
        actor.answer(ComputedStyle.called('stroke').of(RoadMap.road(index)))),
    );
    return [...new Set(colours)].filter((colour) => !GRADE_PALETTE.includes(colour));
  });
