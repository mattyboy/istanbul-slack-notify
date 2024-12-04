#!/usr/bin/env node
import ProcessResponder from "../src/process-responder.js";
import CoverageNotifier from "../src/coverage-notifier.js";
import TextNotify from "../src/text-notify.js";
import CommitInfo from "../src/commit-info.js";
import NycReport from "../src/nyc-report.js";
import fs from "fs";

// Runs Coverage Notifier
const settings = {
    useTextNotify: !process.env.SLACK_WEBHOOK,
    istanbul: {
        coveragePath: "./coverage",
        threshold: 100
    },
    slack: {
        webhook: process.env.SLACK_WEBHOOK
    },
    project: {
        projectName: process.env.npm_package_name
    },
    haltOnFailure: false
};

// Overwrite settings from package.json if defined
const packageJson = JSON.parse(fs.readFileSync("./package.json"));
if (packageJson.coverage) {
    settings.istanbul.coveragePath = packageJson.coverage.coveragePath || settings.istanbul.coveragePath;
    settings.istanbul.threshold = packageJson.coverage.threshold || settings.istanbul.threshold;
    settings.slack.channel = packageJson.coverage.channel || settings.slack.channel;
    settings.slack.username = packageJson.coverage.username || settings.slack.username;
    settings.project.projectName = packageJson.coverage.projectName || settings.project.projectName || packageJson.name;
    settings.project.repositoryUrl = packageJson.coverage.repositoryUrl;
    settings.haltOnFailure = Object.prototype.hasOwnProperty.call(packageJson.coverage, "haltOnFailure")
        ? packageJson.coverage.haltOnFailure
        : settings.haltOnFailure;
}

const reports = new NycReport(settings.istanbul);

const handleResults = () => {
    let coverage = reports.processSummary();
    let build = CommitInfo.git();
    return new Promise((resolve, reject) => {
        return Promise.all([coverage, build])
            .then(values => {
                settings.project.coverage = values[0];
                settings.project.build = values[1];

                if (settings.useTextNotify) {
                    const textNotify = new TextNotify();
                    textNotify.printCoverage(settings.project);
                    resolve(settings);
                } else {
                    const slack = new CoverageNotifier(settings.slack);
                    slack.buildCoveragePayload(settings.project)
                        .then(data => {
                            slack.sendNotification(data);
                            resolve(settings);
                        });
                }
            })
            .catch(error => reject(error));
    });
};

reports
    .generateSummary()
    .then(handleResults)
    .then(settings => ProcessResponder.respond(settings))
    .catch(() => {
        //eslint-disable-next-line no-process-exit
        process.exit(1)
    });
