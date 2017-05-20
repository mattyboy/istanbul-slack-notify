const Promise = require("es6-promise").Promise;
const Slack = require("slack-node");

class SlackNotify {
    constructor(settings) {
        this.settings = settings || {};
        this.settings.timeout = this.settings.timeout || 5000;
        this.settings.result = {pass: {text: "passed", color: "#36a64f"}, fail: {text: "failed", color: "#dc5547"}};
        if (!this.settings.webhook) {
            throw new Error("Slack webhook url is required (settings.webhook)")
        }
    }

    buildCoveragePayload(data) {
        return new Promise((resolve, reject) => {
            if (!data || !data.coverage || !data.build) {
                reject(new Error("Coverage and/or build data was not provided"))
            }
            let threshold = data.coverage.success ? this.settings.result.pass : this.settings.result.fail;
            const payload = {
                username: this.settings.username,
                channel: this.settings.channel,
                icon_emoji: this.settings.icon,
                attachments: [
                    {
                        color: threshold.color,
                        fallback: `Build ${threshold.text} at ${data.coverage.project}% of ${data.coverage.threshold}% threshold`,
                        mrkdwn_in: ['text', 'title'],
                        title: `Build ${threshold.text} for commit ${data.build.shortRevision}`,
                        title_link: `${data.repositoryUrl}/commits/${data.build.revision}`,
                        text: `Total coverage: \`${data.coverage.project}%\` of \`${data.coverage.threshold}%\` threshold`,
                        fields: [
                            {
                                title: "Project Name:",
                                value: `${data.projectName}`,
                                short: false
                            },
                            {
                                title: "Statements",
                                value: `${data.coverage.statements}%`,
                                short: true
                            },
                            {
                                title: "Functions / Methods",
                                value: `${data.coverage.functions}%`,
                                short: true
                            },
                            {
                                title: "Branches",
                                value: `${data.coverage.branches}%`,
                                short: true
                            },
                            {
                                title: "Lines",
                                value: `${data.coverage.lines}%`,
                                short: true
                            }
                        ]
                    },
                ],
            };
            resolve(payload);
        });
    }

    sendNotification(payload) {
        return new Promise((resolve, reject) => {
            if (!payload) {
                reject(new Error("No slack payload provided"))
            }
            const timeout = setTimeout(() => {
                reject(new Error('Took too long to send slack request'));
            }, this.settings.timeout);

            const slack = new Slack();
            slack.setWebhook(this.settings.webhook);
            slack.webhook(payload, (err) => {
                clearTimeout(timeout);
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }
}

module.exports = SlackNotify;
