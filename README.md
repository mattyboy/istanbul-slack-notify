# istanbul-slack-notify

> Version 2.0: See [CHANGELOG.md](CHANGELOG.md) for breaking changes. Moved to support `nyc` and Node 20+

[![Tests](https://github.com/mattyboy/istanbul-slack-notify/actions/workflows/test.yaml/badge.svg)](https://github.com/mattyboy/istanbul-slack-notify/actions/workflows/test.yaml)
[![Coverage Status](https://coveralls.io/repos/github/mattyboy/istanbul-slack-notify/badge.svg?branch=master)](https://coveralls.io/github/mattyboy/istanbul-slack-notify?branch=master)

Sends [nyc](https://www.npmjs.com/package/nyc) (formally istanbul) coverage summary and git build details to Slack, with support for a pass/fail threshold for project coverage.

![screenshot](https://raw.githubusercontent.com/mattyboy/istanbul-slack-notify/master/screenshot.png "Message example")

If SLACK_WEBHOOK is not provided it prints total coverage info to console instead

![screenshot console](https://raw.githubusercontent.com/mattyboy/istanbul-slack-notify/master/screenshot-console.png "Console example")

## Table of Contents

1. [Installation](#installation)
2. [Setup](#setup)
3. [Examples](#examples)
   1. [Via npm task](#example-npm)
   2. [Via cli](#example-cli)
4. [Contributing](#contributing)

## Installation

<a name="installation"></a>

```
npm i --save-dev istanbul-slack-notify@2
```

## Setup

<a name="setup"></a>

**Do not share incoming webhook URLs in public code repositories.**

You will need to configure a webhook for your Slack team: https://api.slack.com/incoming-webhooks

You must define `SLACK_WEBHOOK` as an environment variable.

You can override other default settings in your `package.json` by adding the following section:

```json
{
  "coverage": {
    "threshold": 100,
    "projectName": "Test Slack Notify",
    "repositoryUrl": "https://github.com/mattyboy/test-slack-notifier",
    "coveragePath": "./coverage",
    "username": "coverage-bot",
    "channel": "#random",
    "haltOnFailure": true
  }
}
```

Make sure that nyc coverage json report for your project must be generated first (`coverage/coverage-final.json`)

## Examples

<a name="examples"></a>

### Via npm task

<a name="example-npm"></a>

**Passing SLACK_WEBHOOK at runtime**

Define a couple of npm tasks in `package.json`, assuming you only want slack notify from you CI server.

```json
{
  "scripts": {
    "test": "./node_modules/.bin/jest --coverage",
    "test-ci": "npm test && ./node_modules/.bin/test-slack-notifier"
  }
}
```

Then run tests on your CI server as follows.

```bash
export SLACK_WEBHOOK=https://hooks.slack.com/xxxxx
npm run test-ci
```

Note: If you don't set the SLACK_WEBHOOK it will print totals coverage to console instead

**Defining SLACK_WEBHOOK in package.json**

Make sure to set your SLACK_WEBHOOK environment variable and relevant settings if you want to send a Slack message

```json
{
  "scripts": {
    "test": "./node_modules/.bin/jest --coverage && ./node_modules/.bin/istanbul-slack-notify",
    "test-ci": "npm test && ./node_modules/.bin/istanbul-slack-notify"
  }
}
```

### Via cli

<a name="example-cli"></a>

```bash
# use to test process or called via a CICD script
export SLACK_WEBHOOK=https://hooks.slack.com/xxxxx
./node_modules/.bin/istanbul-slack-notify
```

## Contributing

<a name="contributing"></a>

If you have any feedback or suggestions please let me know. We use this package as part of our CI process and
are open to changes that would be valuable to us and others.
