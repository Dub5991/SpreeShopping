module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: './tsconfig.jest.json',
      diagnostics: {
        // TS1343: import.meta only allowed with ESM module targets (Vite-specific).
        // firebaseConfig is mocked globally via moduleNameMapper so it never executes.
        ignoreCodes: [1343],
      },
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
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/firebase/__mocks__/**',
    '!src/firebase/firebaseConfig.ts',
    '!src/firebase/seedProducts.ts',
  ],
  coverageReporters: ['text', 'lcov'],
};
