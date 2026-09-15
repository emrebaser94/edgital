import { Question } from '@serenity-js/core';
import { Text } from '@serenity-js/web';

import { RoadMap } from '../ui/RoadMap';

/** The visible option labels of the evaluation dropdown (e.g. GW, TWRIO …). */
export const EvaluationOptionLabels = (): Question<Promise<string[]>> =>
  Text.ofAll(RoadMap.evaluationOptions());
