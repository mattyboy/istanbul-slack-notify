import NYC from "nyc";
import fs from "fs";

export default class NycReport {
  #coveragePath = null;
  #threshold = null;

  constructor({coveragePath, threshold} = {}) {
    this.#coveragePath = coveragePath || "./coverage";
    this.#threshold = typeof threshold === "number" ? this.clamp(threshold, 0, 100) : 80;
  }

  clamp(threshold, min, max) {
    return Math.min(Math.max(threshold, min), max);
  }

  /**
   * Use internal workings of nyc/istanbul to get coverage summary
   * @returns {Promise<unknown>}
   */
  generateSummary() {
    const coveragePath = this.#coveragePath;
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(coveragePath)) {
        return reject(new Error("Coverage directory does not exist (settings.coveragePath)"));
      }

      const nyc = new NYC({});
      nyc
        .getCoverageMapFromAllCoverageFiles(coveragePath)
        .then(map => {
          const summary = map.getCoverageSummary();
          resolve(summary.toJSON());
        });
    });
  }

  async processSummary() {
    const summary = await this.generateSummary();
    const {statements, branches, lines, functions} = summary;
    let coverage = {
      statements: statements.pct,
      branches: branches.pct,
      lines: lines.pct,
      functions: functions.pct,
    };
    coverage.project = (coverage.branches + coverage.statements + coverage.lines + coverage.functions) / 4;
    coverage.project = parseFloat(coverage.project.toFixed(2));
    coverage.threshold = this.#threshold;
    coverage.success = this.#threshold <= coverage.project;
    return Promise.resolve(coverage);
  }
}
