import { After, Before } from '@cucumber/cucumber';
import { actorCalled } from '@serenity-js/core';

import { ROAD_WITHOUT_TODO } from '../../src/model';
import { RemoveTodosForRoad } from '../../src/screenplay/tasks';

/**
 * Keep the "add Todo" scenarios deterministic and self-cleaning: the road we
 * click (fid 1307) must have NO Todo before the test (so clicking it creates a
 * fresh one), and any Todo we create is removed afterwards — mirroring the
 * idempotent approach of the Postman/Newman API suite.
 *
 * Housekeeping is done by a dedicated backstage actor, so the persona in the
 * scenarios (Paul) only performs what the Gherkin says. The scenario's
 * Background calls Paul, which moves the spotlight back onto him.
 */
const TEST_DATA_MANAGER = 'Test Data Manager';

Before({ tags: '@todos' }, () =>
  actorCalled(TEST_DATA_MANAGER).attemptsTo(RemoveTodosForRoad(ROAD_WITHOUT_TODO.fid)));

After({ tags: '@todos' }, () =>
  actorCalled(TEST_DATA_MANAGER).attemptsTo(RemoveTodosForRoad(ROAD_WITHOUT_TODO.fid)));
