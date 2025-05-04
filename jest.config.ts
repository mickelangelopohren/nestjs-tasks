import type { Config } from '@jest/types';

const base: Config.InitialOptions = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  modulePaths: ['<rootDir>'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '<rootDir>/coverage',
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
      testMatch: ['<rootDir>/test/unit/**/*.spec.ts'],
    },
    {
      ...base,
      displayName: 'e2e',
      testMatch: ['<rootDir>/test/e2e/**/*.spec.ts'],
    },
  ],
};

export default config;
