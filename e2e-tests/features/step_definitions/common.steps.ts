import { Given } from '@cucumber/cucumber';
import { Actor } from '@serenity-js/core';

import { OpenRoadMap } from '../../src/screenplay/tasks';

Given('{actor} has opened the Road Overview map', (actor: Actor) =>
  actor.attemptsTo(
    OpenRoadMap(),
  ));
