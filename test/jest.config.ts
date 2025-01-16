import type { Config } from 'jest';

const config: Config = {
  verbose: true,

  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../',
  modulePaths: ['<rootDir>'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
};

export default config;
