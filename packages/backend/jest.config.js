/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',

  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/__tests__/mocks/'],
  coverageProvider: 'v8',

  roots: ['<rootDir>/src'],

  testPathIgnorePatterns: ['dist/', '/__tests__/mocks/'],

  transform: {
    '^.+\\.ts?$': ['ts-jest', { tsconfig: 'tsconfig.tests.json' }],
  },
};
