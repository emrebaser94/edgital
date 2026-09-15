import { Task } from '@serenity-js/core';
import { Select } from '@serenity-js/web';

import { RoadMap } from '../ui/RoadMap';

export const SelectEvaluation = (label: string) =>
  Task.where(`#actor selects the "${label}" evaluation`,
    Select.option(label).from(RoadMap.evaluationDropdown()),
  );
