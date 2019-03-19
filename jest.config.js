module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: '@skatejs/ssr/jest',
  setupFilesAfterEnv: ['./test/setup.ts'],
    transformIgnorePatterns: [
       /* "<rootDir>/node_modules/(?!lit-html/.*)",
        "<rootDir>/node_modules/(?!lit-element/.*)",
        "<rootDir>/(?!src/.*)",*/
        "<rootDir>/^(?!test/).*/m",
    ],
};