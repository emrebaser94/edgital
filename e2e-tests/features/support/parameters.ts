import { defineParameterType } from '@cucumber/cucumber';
import { actorCalled, actorInTheSpotlight } from '@serenity-js/core';

/**
 * `{actor}` puts a named persona on the stage, e.g. "Given Paul has opened …".
 * `actorCalled` also moves the spotlight onto that actor.
 */
defineParameterType({
  name: 'actor',
  regexp: /[A-Z][a-z]+/,
  transformer: (name: string) => actorCalled(name),
});

/**
 * `{pronoun}` refers back to the actor in the spotlight, so follow-up steps
 * read naturally: "When he clicks …", "Then he should see …".
 */
defineParameterType({
  name: 'pronoun',
  regexp: /he|she|they|his|her|their/,
  transformer: () => actorInTheSpotlight(),
});
