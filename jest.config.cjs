module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: './tsconfig.jest.json',
      // Disable TS type-checking in Jest — we rely on `tsc -b` for that.
      // Also prevents TS1343 (import.meta) errors if the coverage provider
      // instruments firebaseConfig.ts before the moduleNameMapper stub takes effect.
      diagnostics: false,
    }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Redirect firebaseConfig to a stub — avoids compiling import.meta.env in Jest.
    // Two patterns needed: one for imports like '../../firebase/firebaseConfig',
    // another for the relative './firebaseConfig' used inside src/firebase/auth.ts.
    '^.+/firebase/firebaseConfig$': '<rootDir>/src/firebase/__mocks__/firebaseConfig.ts',
    '^\\.\/firebaseConfig$': '<rootDir>/src/firebase/__mocks__/firebaseConfig.ts',
  },
  // Belt-and-suspenders: exclude firebaseConfig from coverage via both mechanisms.
  // collectCoverageFrom negation patterns exclude it from the file list;
  // coveragePathIgnorePatterns catches it if the coverage provider resolves absolute paths.
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/firebase/__mocks__/**',
    '!src/firebase/firebaseConfig.ts',
    '!src/firebase/seedProducts.ts',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/firebase/firebaseConfig\\.ts$',
    'src/firebase/seedProducts\\.ts$',
    'src/firebase/__mocks__/',
  ],
  coverageReporters: ['text', 'lcov'],
};
