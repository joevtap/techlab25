/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',

  // Coverage
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',

  roots: ['<rootDir>/src'],

  testPathIgnorePatterns: ['dist/'],

  transform: {
    '^.+\\.ts?$': ['ts-jest', { tsconfig: 'tsconfig.tests.json' }],
  },
};
