import { Actor, Cast } from '@serenity-js/core';
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright';
import { CallAnApi } from '@serenity-js/rest';
import type { Browser } from 'playwright';

import { SutConfig } from '../../config';

/**
 * Every actor in this suite can both drive the browser (Playwright) and talk
 * to the json-server REST API directly. The API ability lets us verify that a
 * UI action (e.g. saving a Todo) actually reached the backend, and lets us
 * clean up test data so the suite stays idempotent.
 */
export class Actors implements Cast {
  constructor(
    private readonly browser: Browser,
    private readonly config: SutConfig,
  ) {}

  prepare(actor: Actor): Actor {
    return actor.whoCan(
      BrowseTheWebWithPlaywright.using(
        this.browser,
        { baseURL: this.config.baseURL },
        { defaultNavigationTimeout: 30_000, defaultTimeout: 15_000 },
      ),
      CallAnApi.at(this.config.apiURL),
    );
  }
}
