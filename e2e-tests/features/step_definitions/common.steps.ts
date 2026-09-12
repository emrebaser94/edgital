import { Given } from '@cucumber/cucumber';
import { actorCalled } from '@serenity-js/core';

import { RoadMap } from '../../src/screenplay/map';

Given('the Road Overview map is loaded', () =>
  actorCalled('Tester').attemptsTo(
    RoadMap.isLoaded(),
  ));
