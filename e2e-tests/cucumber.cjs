module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'features/support/**/*.ts',
      'features/step_definitions/**/*.ts',
      'src/**/*.ts',
    ],
    format: [
      '@serenity-js/cucumber',
      'summary',
    ],
    paths: ['features/**/*.feature'],
    publishQuiet: true,
  },
};
