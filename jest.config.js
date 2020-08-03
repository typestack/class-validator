module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts', '!src/**/*.interface.ts'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.spec.json',
    },
  },
};
