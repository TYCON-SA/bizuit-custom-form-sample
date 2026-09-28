// .cjs, not .js: this package is "type": "module" (the build emits ESM), and Jest reads its
// config as CommonJS. A jest.config.js here dies with "module is not defined in ES module scope".

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  transform: {
    '^.+\\.[jt]sx?$': ['ts-jest', {
      // The tsconfig of the repository targets ESM (that is what esbuild bundles). Jest runs
      // CommonJS, so the module system is overridden HERE and only here — changing tsconfig.json
      // instead would break the real build.
      tsconfig: {
        module: 'commonjs',
        jsx: 'react-jsx',
        esModuleInterop: true,
        resolveJsonModule: true,
        allowJs: true,
      },
    }],
  },

  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/test/style-mock.cjs',
  },

  // 🔴 The @tyconsa packages are NOT mocked on purpose.
  //
  // The form imports them, the build marks them external and the host provides them at runtime,
  // so a test that mocks them proves nothing about whether the template still works with the
  // packages as published today. They resolve to their CommonJS build, which Jest reads fine.
  // That is what makes the nightly run worth having: a new version of the SDK or of the
  // components that breaks the template fails here, with no commit in this repository.

  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.ts?(x)'],

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/__tests__/**',
  ],
};
