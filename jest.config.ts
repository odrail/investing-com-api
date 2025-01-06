import type { Config } from 'jest';

const config: Config = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  roots: ["<rootDir>/src/", "<rootDir>/test/"]
};

export default config;