import { Answerable } from '@serenity-js/core';
import { Text } from '@serenity-js/web';

import { RoadMap } from '../ui/RoadMap';

export const LegendText = (): Answerable<string> => Text.of(RoadMap.legend());
