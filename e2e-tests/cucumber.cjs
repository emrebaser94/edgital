module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'features/support/**/*.ts',
      'features/step_definitions/**/*.ts',
      'src/**/*.ts',
    ],
    // Only the Serenity/JS formatter here. Cucumber 13 silently drops a
    // formatter when two of them write to stdout, and the built-in 'summary'
    // formatter also uses stdout — so listing it alongside '@serenity-js/cucumber'
    // caused the Serenity formatter to be dropped, no scenario outcomes (*.json)
    // were written, and the aggregated report came out empty ("0 tests").
    // Serenity's own ConsoleReporter (see features/support/setup.ts) already
    // provides console output.
    format: [
      '@serenity-js/cucumber',
    ],
    // No `paths` here: Cucumber 13 appends CLI paths to configured ones instead
    // of replacing them, so running a single scenario from the IDE
    // (`cucumber-js features/add-todo.feature:14`) would still run the whole
    // suite. Without it, Cucumber falls back to its default feature glob.
    publishQuiet: true,
  },
};
