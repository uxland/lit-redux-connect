module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./test/unit/setup.ts'],
  transformIgnorePatterns:[
      '/^node_modules\\/lit-element/',
      '/^node_modules\\/lit-html/'
  ],
  verbose: true
};