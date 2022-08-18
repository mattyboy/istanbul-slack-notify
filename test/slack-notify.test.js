const SlackNotify = require("../src/slack-notify");
const {project} = require("./constants");

jest.mock('slack-notify', () => {
    return jest.fn()
        .mockImplementation(() => {
            return {
                send: (payload) => {
                    return new Promise((resolve, reject) => {
                        if (payload.error) {
                            reject(payload.error);
                        } else if(payload.timeout) {
                            // do not resolve or reject anything (triggers timeout)
                        } else {
                            resolve();
                        }
                    })
                }
            };
        });
});

const settings = {
    webhook: "https://slack.webhook.com/random/path",
    timeout: 10
};

test('constructor missing webhook url', () => {
    expect(() => {
        new SlackNotify()
    }).toThrowError("Slack webhook url is required (settings.webhook)");
});

test('constructor', () => {
    const slackNotify = new SlackNotify(settings);
    expect(slackNotify.settings.webhook).toBe(settings.webhook);
    expect(slackNotify.settings.timeout).toBe(10);
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
    const slackNotify = new SlackNotify(settings);
    expect.assertions(1);
    return slackNotify.sendNotification({timeout: true}).catch(e => {
        expect(e.message).toMatch('Took too long to send slack request')
    });
});

test('sendNotification - request resolved with no errors', () => {
    const slackNotify = new SlackNotify(settings);
    expect.assertions(1);
    return expect(slackNotify.sendNotification({})).resolves.toBeUndefined();
});

test('sendNotification - request resolves with errors', () => {
    const slackNotify = new SlackNotify(settings);
    expect.assertions(1);
    return expect(slackNotify.sendNotification({error: 'fake error was thrown'})).rejects.toBe('fake error was thrown');
});

