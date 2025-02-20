import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testPathIgnorePatterns: ['/node_modules/', 'dist/'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testTimeout: 3600000
}

export default config
