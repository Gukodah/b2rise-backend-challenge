module.exports = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  testMatch: [
    "**/__tests__/**/*.+(js|jsx|ts|tsx)",
    "**/?(*.)+(spec|test).+(js|jsx|ts|tsx)",
  ],
};
