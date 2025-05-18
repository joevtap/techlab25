const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',

  // Coverage
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',

  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/core/$1',
    '@auth/(.*)': '<rootDir>/src/modules/auth/$1',
  },
  roots: ['<rootDir>/'],

  testPathIgnorePatterns: ['dist/'],

  transform: {
    ...tsJestTransformCfg,
  },
};
