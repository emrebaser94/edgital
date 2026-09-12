import { Then, When } from '@cucumber/cucumber';
import { actorCalled, Duration, Wait } from '@serenity-js/core';
import { contain, Ensure, equals, isTrue } from '@serenity-js/assertions';
import { By, isVisible, Navigate, PageElement } from '@serenity-js/web';

import { RoadMap } from '../../src/screenplay/map';
import { fillAndSaveTodo, TodoModal } from '../../src/screenplay/todoModal';
import { ROAD_WITHOUT_TODO, StoredTodoAuthors, TodosForRoad } from '../../src/api';

const todosTableCellContaining = (text: string) =>
  PageElement.located(By.cssContainingText('td', text)).describedAs(`Todos cell "${text}"`);

When('Tester clicks on the road without an existing Todo', () =>
  actorCalled('Tester').attemptsTo(
    RoadMap.clickRoad(ROAD_WITHOUT_TODO.mapIndex),
    Wait.upTo(Duration.ofSeconds(10)).until(TodoModal.heading(), isVisible()),
  ));

When('Tester fills in the Todo form with description {string}, status {string} and author {string}',
  (description: string, status: string, author: string) =>
    actorCalled('Tester').attemptsTo(
      fillAndSaveTodo({ description, status, author }),
    ));

Then('the backend stores a Todo for that road authored by {string}', (author: string) =>
  actorCalled('Tester').attemptsTo(
    TodosForRoad(ROAD_WITHOUT_TODO.fid),
    Ensure.that(StoredTodoAuthors(), contain(author)),
  ));

Then('the Todos overview page lists a Todo authored by {string}', (author: string) =>
  actorCalled('Tester').attemptsTo(
    Navigate.to('/todos'),
    Wait.upTo(Duration.ofSeconds(10)).until(todosTableCellContaining(author), isVisible()),
    Ensure.that(todosTableCellContaining(author), isVisible()),
  ));

// --- @defect scenarios: assert the REQUIRED behaviour, so they fail on purpose ---

Then('the Todo form action button should read {string}', (expected: string) =>
  actorCalled('Tester').attemptsTo(
    Ensure.that(TodoModal.actionButtonLabel(), equals(expected)),
  ));

Then('the Todo title field should be editable', () =>
  actorCalled('Tester').attemptsTo(
    Ensure.that(TodoModal.titleIsEditable(), isTrue()),
  ));
