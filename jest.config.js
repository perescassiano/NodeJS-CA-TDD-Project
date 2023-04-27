module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  collectCoverageFrom: ['**/src/**/*.js', '!**/src/main/*'],
  preset: '@shelf/jest-mongodb'
}
