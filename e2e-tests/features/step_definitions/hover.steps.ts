import { Then, When } from '@cucumber/cucumber';
import { Actor } from '@serenity-js/core';
import { Ensure, equals, includes } from '@serenity-js/assertions';

import { ROAD_FOR_HOVER } from '../../src/model';
import {
  GradeColourFromApi,
  GradeLineFromApi,
  RoadStrokeColour,
  TooltipText,
  TooltipTextFromApi,
} from '../../src/screenplay/questions';
import { FetchRoads, InspectRoad, StopInspectingRoad } from '../../src/screenplay/tasks';

When('{pronoun} hovers over a road', (actor: Actor) =>
  actor.attemptsTo(
    InspectRoad(ROAD_FOR_HOVER),
  ));

When('{pronoun} hovers over a road and moves the mouse away', (actor: Actor) =>
  actor.attemptsTo(
    InspectRoad(ROAD_FOR_HOVER),
    StopInspectingRoad(ROAD_FOR_HOVER.fid),
  ));

Then('{pronoun} should see the attributes and the {string} grade of that road in the tooltip', (actor: Actor, evaluation: string) =>
  actor.attemptsTo(
    FetchRoads(),
    Ensure.that(TooltipText(ROAD_FOR_HOVER.fid), equals(TooltipTextFromApi(ROAD_FOR_HOVER.fid, evaluation))),
  ));

// --- @defect scenarios: assert the REQUIRED behaviour, so they fail on purpose ---

Then('{pronoun} should see the {string} grade of that road in the tooltip', (actor: Actor, evaluation: string) =>
  actor.attemptsTo(
    FetchRoads(),
    Ensure.that(TooltipText(ROAD_FOR_HOVER.fid), includes(GradeLineFromApi(ROAD_FOR_HOVER.fid, evaluation))),
  ));

Then('{pronoun} should see that road coloured by its {string} grade', (actor: Actor, evaluation: string) =>
  actor.attemptsTo(
    FetchRoads(),
    Ensure.that(RoadStrokeColour(ROAD_FOR_HOVER.mapIndex), equals(GradeColourFromApi(ROAD_FOR_HOVER.fid, evaluation))),
  ));
