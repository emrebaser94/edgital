import { Then, When } from '@cucumber/cucumber';
import { Actor, Duration } from '@serenity-js/core';
import { contain, Ensure, equals, isTrue } from '@serenity-js/assertions';
import { isVisible } from '@serenity-js/web';

import { ROAD_WITHOUT_TODO } from '../../src/model';
import { StoredTodoAuthors, TodoActionButtonLabel, TodoTitleIsEditable } from '../../src/screenplay/questions';
import { FetchTodosForRoad, FillAndSaveTodo, OpenTodoFormForRoad, OpenTodosPage } from '../../src/screenplay/tasks';
import { TodosPage } from '../../src/screenplay/ui';

When('{pronoun} clicks on a road that has no Todo yet', (actor: Actor) =>
  actor.attemptsTo(
    OpenTodoFormForRoad(ROAD_WITHOUT_TODO.mapIndex),
  ));

When('{pronoun} saves a Todo with description {string}, status {string} and author {string}',
  (actor: Actor, description: string, status: string, author: string) =>
    actor.attemptsTo(
      FillAndSaveTodo({ description, status, author }),
    ));

Then('{pronoun} should find a Todo authored by {string} stored for that road', (actor: Actor, author: string) =>
  actor.attemptsTo(
    FetchTodosForRoad(ROAD_WITHOUT_TODO.fid),
    Ensure.that(StoredTodoAuthors(), contain(author)),
  ));

Then('{pronoun} should see a Todo authored by {string} on the Todos overview page', (actor: Actor, author: string) =>
  actor.attemptsTo(
    OpenTodosPage(),
    Ensure.eventually(TodosPage.cellContaining(author), isVisible()).timeoutAfter(Duration.ofSeconds(10)),
  ));

// --- @defect scenarios: assert the REQUIRED behaviour, so they fail on purpose ---

Then('{pronoun} should see the Todo form action button labelled {string}', (actor: Actor, expected: string) =>
  actor.attemptsTo(
    Ensure.that(TodoActionButtonLabel(), equals(expected)),
  ));

Then('{pronoun} should be able to edit the Todo title', (actor: Actor) =>
  actor.attemptsTo(
    Ensure.that(TodoTitleIsEditable(), isTrue()),
  ));
