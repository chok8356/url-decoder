module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': ['esbuild-jest', { sourcemap: true }],
  },
  testMatch: [
    '**/__tests__/**/*.ts',
  ],
  moduleFileExtensions: ['js', 'ts', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 98,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coverageReporters: ['html', ['text', { skipFull: true }], 'text-summary'],
  coveragePathIgnorePatterns: ['/node_modules/', 'src/assets/'],
  testPathIgnorePatterns: ['/node_modules/'],
};
