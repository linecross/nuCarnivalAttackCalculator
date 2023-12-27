import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",

  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    // '^.+\\.tsx?$': [
    //   // 'ts-jest',
    //   // 'esbuild-jest',
    //   '@swc/jest',
    //   {
    //     useESM: true,
    //   },
    // ],
    
    "^.+\\.(t|j)sx?$": "@swc/jest",
    // '^.+\\.tsx?$': 'esbuild-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/jest/**.ts']
}

export default jestConfig