import { Then, When } from '@cucumber/cucumber';
import { Actor, Duration } from '@serenity-js/core';
import { endsWith, Ensure, includes } from '@serenity-js/assertions';

import { CurrentUrl, PageText } from '../../src/screenplay/questions';
import { OpenMenuEntry } from '../../src/screenplay/tasks';

When('{pronoun} opens {string} from the navigation bar', (actor: Actor, menu: string) =>
  actor.attemptsTo(
    OpenMenuEntry(menu),
  ));

Then('{pronoun} should see the browser address ending with {string}', (actor: Actor, path: string) =>
  actor.attemptsTo(
    Ensure.eventually(CurrentUrl(), endsWith(path)).timeoutAfter(Duration.ofSeconds(10)),
  ));

Then('{pronoun} should see {string} on the page', (actor: Actor, marker: string) =>
  actor.attemptsTo(
    Ensure.eventually(PageText(), includes(marker)).timeoutAfter(Duration.ofSeconds(10)),
  ));
