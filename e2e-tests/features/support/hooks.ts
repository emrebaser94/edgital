import { After, Before } from '@cucumber/cucumber';
import { actorCalled } from '@serenity-js/core';

import { RemoveTodosForRoad, ROAD_WITHOUT_TODO } from '../../src/api';

/**
 * Keep the "add Todo" scenarios deterministic and self-cleaning: the road we
 * click (fid 1307) must have NO Todo before the test (so clicking it creates a
 * fresh one), and any Todo we create is removed afterwards — mirroring the
 * idempotent approach of the Postman/Newman API suite.
 */
Before({ tags: '@todos' }, () =>
  actorCalled('Tester').attemptsTo(RemoveTodosForRoad(ROAD_WITHOUT_TODO.fid)));

After({ tags: '@todos' }, () =>
  actorCalled('Tester').attemptsTo(RemoveTodosForRoad(ROAD_WITHOUT_TODO.fid)));
