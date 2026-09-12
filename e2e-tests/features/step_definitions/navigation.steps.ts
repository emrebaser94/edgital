import { Then, When } from '@cucumber/cucumber';
import { actorCalled, Duration, Question, Wait } from '@serenity-js/core';
import { endsWith, Ensure, includes } from '@serenity-js/assertions';
import { BrowseTheWeb, Text } from '@serenity-js/web';

import { Menu, PageBody } from '../../src/screenplay/pages';

/** The browser's current URL (read from the native Playwright page). */
const currentUrl = () =>
  Question.about<Promise<string>>('the current URL', async (actor) => {
    const page: any = await BrowseTheWeb.as(actor).currentPage();
    const native = await page.nativePage();
    return native.url();
  });

When('Tester opens {string} from the navigation bar', (menu: string) =>
  actorCalled('Tester').attemptsTo(
    Menu.open(menu),
  ));

Then('the browser address ends with {string}', (path: string) =>
  actorCalled('Tester').attemptsTo(
    Wait.upTo(Duration.ofSeconds(10)).until(currentUrl(), endsWith(path)),
    Ensure.that(currentUrl(), endsWith(path)),
  ));

Then('the page shows {string}', (marker: string) =>
  actorCalled('Tester').attemptsTo(
    Wait.upTo(Duration.ofSeconds(10)).until(Text.of(PageBody()), includes(marker)),
    Ensure.that(Text.of(PageBody()), includes(marker)),
  ));
