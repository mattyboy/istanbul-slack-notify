import {expect, test} from "@jest/globals";
import NycReport from "../src/nyc-report";
import path from "path";
import {v7 as uuid} from "uuid";
import fs from "fs";
import os from "os";

const settings = {
  coveragePath: "test/data/sample-coverage",
  threshold: 20.52,
};

beforeEach(() => {
  settings.coveragePath = "test/data/sample-coverage";
});

test("constructor", () => {
  const report = new NycReport();
  expect(report).toBeDefined();
});

test("generateSummary - coverage directory does not exist", () => {
  const invalidDirectory = path.join(os.tmpdir(), `nyc-test-directory-${uuid()}`);
  const report = new NycReport({coveragePath: invalidDirectory});
  return expect(report.generateSummary()).rejects.toThrowError("Coverage directory does not exist (settings.coveragePath)");
});

test("generateSummary - no coverage file (empty coverage directory)", () => {
  const emptyDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "nyc-test"));
  const report = new NycReport({coveragePath: emptyDirectory});
  return expect(report.generateSummary()).resolves.toMatchObject({
    branches: {covered: 0, pct: "Unknown", skipped: 0, total: 0},
    branchesTrue: {covered: 0, pct: "Unknown", skipped: 0, total: 0},
    functions: {covered: 0, pct: "Unknown", skipped: 0, total: 0},
    lines: {covered: 0, pct: "Unknown", skipped: 0, total: 0},
    statements: {covered: 0, pct: "Unknown", skipped: 0, total: 0},
  });
});

test("generateSummary", () => {
  const report = new NycReport(settings);
  expect.assertions(1);
  return expect(report.generateSummary()).resolves.toMatchObject({
    branches: {covered: 18, pct: 38.29, skipped: 0, total: 47},
    branchesTrue: {covered: 0, pct: "Unknown", skipped: 0, total: 0},
    functions: {covered: 6, pct: 24, skipped: 0, total: 25},
    lines: {covered: 29, pct: 32.22, skipped: 0, total: 90},
    statements: {covered: 29, pct: 32.22, skipped: 0, total: 90},
  });
});

test("processSummary", () => {
  const report = new NycReport(settings);
  return expect(report.processSummary()).resolves.toMatchObject({
    statements: 32.22,
    branches: 38.29,
    lines: 32.22,
    functions: 24,
    project: 31.68,
    threshold: 20.52,
    success: true,
  });
});
