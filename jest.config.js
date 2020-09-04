module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'api/tsconfig.json',
    },
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  roots: ['api'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  testMatch: ['**/*.test.(ts|js)'],
  testEnvironment: 'node',
  preset: 'ts-jest',
  collectCoverageFrom: [
    './api/**/*.ts',
    '!./api/migration/**',
    '!./api/tests/**',
    '!./api/index.ts',
    '!./api/app.ts',
    '!./api/logger.ts',
  ],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 25,
      functions: 10,
      lines: 50,
    },
  },
};
