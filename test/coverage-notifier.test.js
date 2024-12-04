import {jest, expect, test, afterEach} from "@jest/globals";
import {project} from "./constants";

// Important: Mock before we import coverageNotifier
jest.unstable_mockModule("slack-notify", () => ({
  default: (webhookUrl) => {
    return {
      send: (payload) => {
        expect(webhookUrl).toBe("https://slack.webhook.com/random/path");
        if (payload.error) {
            return Promise.reject(payload.error);
        } else if(payload.timeout) {
          // do not resolve or reject anything (triggers timeout)
          return new Promise(() => {});
        } else {
            return Promise.resolve();
        }
      }
    }
  },
}));

const CoverageNotifierModule = await import("../src/coverage-notifier");
const CoverageNotifier = CoverageNotifierModule.default;

const settings = {
  webhook: "https://slack.webhook.com/random/path",
  timeout: 10,
};

afterEach(() => {
  jest.resetAllMocks();
});

test("constructor missing webhook url", () => {
  expect(() => {
    new CoverageNotifier();
  }).toThrowError("Slack webhook url is required (settings.webhook)");
});

test("constructor", () => {
  const coverageNotifier = new CoverageNotifier(settings);
  expect(coverageNotifier.settings.webhook).toBe(settings.webhook);
  expect(coverageNotifier.settings.timeout).toBe(10);
  expect(coverageNotifier.settings.result.fail.color).toBe("#dc5547");
  expect(coverageNotifier.settings.result.fail.text).toBe("failed");
  expect(coverageNotifier.settings.result.pass.color).toBe("#36a64f");
  expect(coverageNotifier.settings.result.pass.text).toBe("passed");
});

test("buildCoveragePayload - data is missing", () => {
  const coverageNotifier = new CoverageNotifier(settings);
  expect.assertions(1);
  return coverageNotifier.buildCoveragePayload().catch(e => expect(e.message).toMatch("Coverage and/or build data was not provided"));
});

test("buildCoveragePayload - data is empty", () => {
  const coverageNotifier = new CoverageNotifier(settings);
  expect.assertions(1);
  return coverageNotifier.buildCoveragePayload({}).catch(e => expect(e.message).toMatch("Coverage and/or build data was not provided"));
});

test("buildCoveragePayload", () => {
  const coverageNotifier = new CoverageNotifier(settings);
  expect.assertions(1);
  return coverageNotifier.buildCoveragePayload(project).then(data => {
    expect(data).toBeDefined();
  });
});

test("buildCoveragePayload - coverage failed, single ref", () => {
  const coverageNotifier = new CoverageNotifier(settings);
  expect.assertions(1);
  project.coverage.success = false;
  project.build.refs = ["ref0"];
  return coverageNotifier.buildCoveragePayload(project).then(data => {
    expect(data).toBeDefined();
  });
});

test("sendNotification - payload is missing", () => {
  const coverageNotifier = new CoverageNotifier(settings);
  return expect(coverageNotifier.sendNotification()).rejects.toThrow("No slack payload provided");
});

test("sendNotification - request too long timeout", () => {
  const coverageNotifier = new CoverageNotifier(settings);
  return expect(coverageNotifier.sendNotification({timeout: true})).rejects.toThrow("Took too long to send slack request");
});

test("sendNotification - request resolved with no errors", () => {
  const coverageNotifier = new CoverageNotifier(settings);
  return expect(coverageNotifier.sendNotification({})).resolves.toBeUndefined();
});

test("sendNotification - request resolves with errors", () => {
  const coverageNotifier = new CoverageNotifier(settings);
  return expect(coverageNotifier.sendNotification({error: "fake error was thrown"})).rejects.toBe("fake error was thrown");
});
