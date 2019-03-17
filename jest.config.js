module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: '@skatejs/ssr/jest',
  setupFilesAfterEnv: ['./test/setup.ts'],
  transformIgnorePatterns:[
      '/^node_modules\\/lit-element/',
      '/^node_modules\\/lit-html/'
  ]
};