const config = {
  verbose: true,
  collectCoverage: true,
  transform: {},
  collectCoverageFrom: ["src/**"],
  coverageReporters: ["json", "lcov", "text-summary"],
};

export default config;
