import '@testing-library/jest-dom';

// 🔴 DEV_MODE has to be set BEFORE the form is imported.
//
// src/utils/sentry.ts reads window.DEV_MODE at import time: when it is not true it assumes
// production, initialises GlitchTip and REPLACES console.log/console.warn with silent versions.
// Under Jest that means the first `import` of the form silently mutates the console of every
// later test, and any test asserting on a log sees nothing.
//
// Jest runs setupFilesAfterEnv before the test file (and therefore before its imports), so this
// is the one place where the flag lands in time.
(window as unknown as { DEV_MODE: boolean }).DEV_MODE = true;

// jsdom implements no media queries, and BizuitThemeProvider asks for the colour scheme on mount
// (window.matchMedia('(prefers-color-scheme: dark)')). Without this shim every render of a form
// that uses the provider — that is, every form — dies with "window.matchMedia is not a function".
// Light theme is reported, which is what the BIZUIT host shows by default.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},      // deprecated, still called by some libraries
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
