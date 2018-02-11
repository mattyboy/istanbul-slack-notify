const SlackNotify = require("../src/slack-notify");
const {project} = require("./constants");

jest.mock('slack-node');

const settings = {
    webhook: "http://slack.webhook.com/random/path",
    timeout: 50
};

test('constructor missing webhook url', () => {
    expect(() => {
        new SlackNotify()
    }).toThrowError("Slack webhook url is required (settings.webhook)");
});

test('constructor', () => {
    const slackNotify = new SlackNotify(settings);
    expect(slackNotify.settings.webhook).toBe(settings.webhook);
    expect(slackNotify.settings.timeout).toBe(50);
    expect(slackNotify.settings.result.fail.color).toBe("#dc5547");
    expect(slackNotify.settings.result.fail.text).toBe("failed");
    expect(slackNotify.settings.result.pass.color).toBe("#36a64f");
    expect(slackNotify.settings.result.pass.text).toBe("passed");
});

test('buildCoveragePayload - data is missing', () => {
    const slackNotify = new SlackNotify(settings);
    expect.assertions(1);
    return slackNotify.buildCoveragePayload().catch(e =>
        expect(e.message).toMatch('Coverage and/or build data was not provided')
    );
});

test('buildCoveragePayload - data is empty', () => {
    const slackNotify = new SlackNotify(settings);
    expect.assertions(1);
    return slackNotify.buildCoveragePayload({}).catch(e =>
        expect(e.message).toMatch('Coverage and/or build data was not provided')
    );
});

test('buildCoveragePayload', () => {
    const slackNotify = new SlackNotify(settings);
    expect.assertions(1);
    return slackNotify.buildCoveragePayload(project).then(data => {
        expect(data).toBeDefined();
    });
});

test('buildCoveragePayload - coverage failed, single ref', () => {
    const slackNotify = new SlackNotify(settings);
    expect.assertions(1);
    project.coverage.success = false;
    project.build.refs = ["ref0"];
    return slackNotify.buildCoveragePayload(project).then(data => {
        expect(data).toBeDefined();
    });
});

test('sendNotification - payload is missing', () => {
    const slackNotify = new SlackNotify(settings);
    expect.assertions(1);
    return slackNotify.sendNotification().catch(e =>
        expect(e.message).toMatch('No slack payload provided')
    );
});

test('sendNotification - request too long timeout', () => {
    const timoutSettings = {
        webhook: "http://slack.webhook.com/timeout",
        timeout: 10
    };
    const slackNotify = new SlackNotify(timoutSettings);
    expect.assertions(1);
    return slackNotify.sendNotification({}).catch(e =>
        expect(e.message).toMatch('Took too long to send slack request')
    );
});

test('sendNotification', () => {
    const slackNotify = new SlackNotify(settings);
    expect.assertions(1);
    return expect(slackNotify.sendNotification({})).resolves.toBeUndefined();
});

test('sendNotification', () => {
    const errorSettings = {
        webhook: "http://slack.webhook.com/error"
    };
    const slackNotify = new SlackNotify(errorSettings);
    expect.assertions(1);
    return expect(slackNotify.sendNotification({})).rejects.toBe("fake error was thrown");
});

