import { AfterAll, BeforeAll, setDefaultTimeout } from '@cucumber/cucumber';
import { ArtifactArchiver, configure, engage } from '@serenity-js/core';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { SerenityBDDReporter } from '@serenity-js/serenity-bdd';
import { Photographer, TakePhotosOfFailures } from '@serenity-js/web';
import { Browser, chromium } from 'playwright';

import { Actors } from '../../src/Actors';
import { config } from '../../src/config';

let browser: Browser;

// Cucumber's default step timeout (5s) is too low for map rendering.
setDefaultTimeout(60_000);

BeforeAll(async () => {
  browser = await chromium.launch({
    headless: process.env.HEADLESS !== 'false',
  });

  configure({
    crew: [
      ArtifactArchiver.storingArtifactsAt('./target/site/serenity'),
      Photographer.whoWill(TakePhotosOfFailures),
      SerenityBDDReporter.fromJSON({ specDirectory: './features' }),
      ConsoleReporter.forDarkTerminals(),
    ],
  });

  engage(new Actors(browser, config));
});

AfterAll(async () => {
  await browser?.close();
});
