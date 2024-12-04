import {expect, jest, test} from "@jest/globals";
import TextNotify from "../src/text-notify";
import {project} from "./constants";

const consoleSpy = jest.spyOn(console, "log");

test("constructor", () => {
  expect.assertions(3);
  const textNotify = new TextNotify();
  expect(textNotify.emojis).toBeDefined();
  expect(textNotify.emojis.fail).toHaveLength(6);
  expect(textNotify.emojis.pass).toHaveLength(5);
});

test("printCoverage - data is missing", () => {
  expect.assertions(1);
  try {
    const textNotify = new TextNotify();
    textNotify.printCoverage();
  } catch (err) {
    expect(err.message).toBe("coverage information missing");
  }
});

test("printCoverage - data is empty", () => {
  expect.assertions(1);
  try {
    const textNotify = new TextNotify();
    textNotify.printCoverage({});
  } catch (err) {
    expect(err.message).toBe("coverage information missing");
  }
});

test("printCoverage - coverage passed", () => {
  expect.assertions(1);
  project.coverage.success = true;
  const textNotify = new TextNotify();
  textNotify.printCoverage(project);
  expect(consoleSpy).toHaveBeenCalledTimes(2);
  consoleSpy.mockReset();
});

test("printCoverage - coverage failed", () => {
  expect.assertions(1);
  project.coverage.success = false;
  const textNotify = new TextNotify();
  textNotify.printCoverage(project);
  expect(consoleSpy).toHaveBeenCalledTimes(2);
  consoleSpy.mockReset();
  consoleSpy.mockRestore();
});
