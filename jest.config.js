module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': '@vue/vue2-jest',
    '^.+\\.[jt]sx?$': ['esbuild-jest', { sourcemap: true }],
    '.+\\.(css|styl|less|sass|scss|jpg|jpeg|png|svg|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|avif)$':
      require.resolve('jest-transform-stub'),
  },
  testMatch: [
    '**/__tests__/**/*.ts',
  ],
  moduleFileExtensions: ['json', 'js', 'jsx', 'ts', 'd.ts', 'tsx', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@sailplay/ui/(.*)$': '<rootDir>/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx,vue}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.story.ts',
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
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/', 'src/assets/'],
  testPathIgnorePatterns: ['/node_modules/'],
  snapshotSerializers: [
    '<rootDir>/node_modules/jest-serializer-vue-tjw',
  ],
};
