module.exports = {
  setupFilesAfterEnv: ["<rootDir>src/setupTests.ts"],
  testPathIgnorePatterns: ["<rootDir>/cypress/"],
  moduleDirectories: ["node_modules", "src"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  }
};
