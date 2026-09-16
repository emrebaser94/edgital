import { Then, When } from '@cucumber/cucumber';
import { Actor, Duration } from '@serenity-js/core';
import { contain, Ensure, equals, isTrue } from '@serenity-js/assertions';
import { isVisible } from '@serenity-js/web';

import { ROAD_WITH_SEVERAL_TODOS, ROAD_WITHOUT_TODO } from '../../src/model';
import {
  StoredTodoAuthors,
  StoredTodoCount,
  TodoActionButtonLabel,
  TodoCounterText,
  TodoTitleIsEditable,
  TodoTitleValue,
} from '../../src/screenplay/questions';
import {
  FetchTodosForRoad,
  FillAndSaveNewTodo,
  FillAndSaveTodo,
  OpenTodoFormForRoad,
  OpenTodosPage,
  PageToNextTodo,
  StartNewTodo,
} from '../../src/screenplay/tasks';
import { TodoModal, TodosPage } from '../../src/screenplay/ui';

When('{pronoun} clicks on a road that has no Todo yet', (actor: Actor) =>
  actor.attemptsTo(
    OpenTodoFormForRoad(ROAD_WITHOUT_TODO.mapIndex),
  ));

When('{pronoun} clicks on a road that has several Todos', (actor: Actor) =>
  actor.attemptsTo(
    OpenTodoFormForRoad(ROAD_WITH_SEVERAL_TODOS.mapIndex),
  ));

When('{pronoun} saves a Todo with description {string}, status {string} and author {string}',
  (actor: Actor, description: string, status: string, author: string) =>
    actor.attemptsTo(
      FillAndSaveTodo({ description, status, author }),
    ));

When('{pronoun} starts a new Todo and saves it with title {string}, description {string}, status {string} and author {string}',
  (actor: Actor, title: string, description: string, status: string, author: string) =>
    actor.attemptsTo(
      StartNewTodo(),
      FillAndSaveNewTodo({ title, description, status, author }),
    ));

When('{pronoun} pages to the next Todo', (actor: Actor) =>
  actor.attemptsTo(
    PageToNextTodo(),
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

Then('{pronoun} should see Todo {int} of {int} in the Todo form', (actor: Actor, current: number, total: number) =>
  actor.attemptsTo(
    Ensure.that(TodoModal.todoCounter(), isVisible()),
    Ensure.that(TodoCounterText(), equals(`${current} / ${total}`)),
  ));

Then('{pronoun} should see the Todo titled {string}', (actor: Actor, title: string) =>
  actor.attemptsTo(
    Ensure.that(TodoTitleValue(), equals(title)),
  ));

Then('{pronoun} should be able to start a new Todo', (actor: Actor) =>
  actor.attemptsTo(
    Ensure.that(TodoModal.newTodoButton(), isVisible()),
  ));

Then('{pronoun} should find {int} Todos stored for that road with several Todos', (actor: Actor, total: number) =>
  actor.attemptsTo(
    FetchTodosForRoad(ROAD_WITH_SEVERAL_TODOS.fid),
    Ensure.that(StoredTodoCount(), equals(total)),
  ));
