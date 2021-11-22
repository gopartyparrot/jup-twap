/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  setupFiles: ["dotenv/config"],
  testEnvironment: "node",
  testTimeout: 60_000,
};
