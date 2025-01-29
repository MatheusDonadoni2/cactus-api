import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';

const config: Config = {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../',
  modulePaths: ['<rootDir>'],
  testRegex: '.*\\e2e.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(
    {
      '~/*': ['./src/*'],
      '~backOffice/*': ['./src/domain/back-office/*'],
      '~customErrors/*': ['./src/core/error/custom-errors-class/*'],
      '~infra/*': ['./src/infra/*'],
    },
    {
      prefix: '<rootDir>',
    },
  ),
};

export default config;
