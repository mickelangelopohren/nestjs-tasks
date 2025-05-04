import type { Config } from '@jest/types';

const base: Config.InitialOptions = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  modulePaths: ['<rootDir>'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
};

const config: Config.InitialOptions = {
  projects: [
    {
      ...base,
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/unit/**/*.spec.ts'],
      collectCoverageFrom: ['src/**/*.(t|j)s'],
      coverageDirectory: '<rootDir>/coverage',
      coverageThreshold: {
        global: {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100,
        },
      },
    },
    {
      ...base,
      displayName: 'e2e',
      testMatch: ['<rootDir>/tests/e2e/**/*.spec.ts'],
    },
  ],
};

export default config;
