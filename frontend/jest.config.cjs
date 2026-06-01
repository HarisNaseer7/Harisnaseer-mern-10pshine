module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['./jest.setup.cjs'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/src/__mocks__/fileMock.cjs',
  },
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  globals: {
    'import.meta': { env: { VITE_API_URL: 'http://localhost:5000/api' } },
  },
  coverageThreshold: {
    global: { lines: 10, statements: 10, branches: 5, functions: 5 }
  },
};