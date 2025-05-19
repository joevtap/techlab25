const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

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
    ...tsJestTransformCfg,
  },
};
