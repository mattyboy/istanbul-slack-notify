import {jest, expect, test, afterEach} from "@jest/globals";

// Important: Mock before we import CommitInfo
const mockExec = jest.fn();
jest.unstable_mockModule("node:child_process", () => ({
  exec: mockExec,
}));

const CommitInfoModule = await import("../src/commit-info");
const CommitInfo = CommitInfoModule.default;

const TEST_STDOUT = ["shortRevision", "revision", "date", "subject", "author", "authorEmail", " (HEAD, origin/master, origin/HEAD, master)"];

afterEach(() => {
  jest.resetAllMocks();
});

test("git", () => {
  mockExec.mockImplementationOnce((cmd, cb) => {
    expect(cmd).toEqual(expect.stringMatching(/^git log.*HEAD$/));
    cb(null, TEST_STDOUT.join("$$$"), "");
  });
  return expect(CommitInfo.git()).resolves.toMatchObject({
    shortRevision: "shortRevision",
    revision: "revision",
    subject: "subject",
    author: "author",
    refs: ["HEAD", "origin/master", "origin/HEAD", "master"],
  });
});

test("git - error", () => {
  mockExec.mockImplementationOnce((cmd, cb) => {
    cb(new Error("mock command error"), "stdout", "stderr");
  });
  return expect(CommitInfo.git()).rejects.toMatchObject({
    message: "mock command error",
    stderr: "stderr",
  });
});
