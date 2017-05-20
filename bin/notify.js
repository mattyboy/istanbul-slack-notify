const IstanbulReport = require("../src/istanbul-report");
const SlackNotify = require("../src/slack-notify");
const BuildInfo = require("../src/build-info");
const packageJson = require("../package.json");

if(!process.env.SLACK_WEBHOOK) {
    throw Error("SLACK_WEBHOOK must be defined as environment variable.")
}

// Runs Coverage Notifier
const settings = {
    istanbul: {
        rootDir: process.env.PWD,
        coverageFiles: ["coverage/coverage-final.json"],
        summaryFile: "coverage/coverage-summary.json",
        threshold: 100
    },
    slack: {
        webhook: process.env.SLACK_WEBHOOK,
        channel: process.env.SLACK_CHANNEL,
        username: process.env.SLACK_USERNAME,
    },
    project: {
        projectName: process.env.npm_package_name,
        repositoryUrl: process.env.npm_package_homepage
    }
};

// Overwrite settings from package.json if defined
if(packageJson.coverage) {
    settings.istanbul.coverageFiles = packageJson.coverage.coverageFiles || settings.istanbul.coverageFiles;
    settings.istanbul.threshold = packageJson.coverage.threshold || settings.istanbul.threshold;
    settings.slack.channel = packageJson.coverage.channel || settings.slack.channel;
    settings.slack.username = packageJson.coverage.username || settings.slack.username;
    settings.project.projectName = packageJson.projectName || settings.project.projectName;
    settings.project.repositoryUrl = packageJson.repositoryUrl || settings.project.repositoryUrl;
}

const reports = new IstanbulReport(settings.istanbul);
const slack = new SlackNotify(settings.slack);
reports.generateSummary()
    .then(() => {
        let coverage = reports.processSummary();
        let build = BuildInfo.git();
        Promise.all([coverage, build]).then(values => {
            settings.project.coverage = values[0];
            settings.project.build = values[1];
            slack.buildCoveragePayload(settings.project)
                .then((data) => slack.sendNotification(data));
        })
    });
