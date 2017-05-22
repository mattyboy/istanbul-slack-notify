# istanbul-slack-notify

[![Build Status](https://travis-ci.org/mattyboy/istanbul-slack-notify.svg?branch=master)](https://travis-ci.org/mattyboy/istanbul-slack-notify) 
[![Coverage Status](https://coveralls.io/repos/github/mattyboy/istanbul-slack-notify/badge.svg?branch=master)](https://coveralls.io/github/mattyboy/istanbul-slack-notify?branch=master)

Sends istanbul / jest coverage summary and git build details to Slack using a pass/fail threshold for project coverage.

![screenshot](https://raw.githubusercontent.com/mattyboy/istanbul-slack-notify/master/screenshot.png "Message example")

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
npm i --save-dev istanbul-slack-notify
```

## Setup
<a name="setup"></a>

**Do not share incoming webhook URLs in public code repositories.**

You will need to configure a webhook for your Slack team: https://api.slack.com/incoming-webhooks

You must define `SLACK_WEBHOOK` as an environment variable.

You can override other default settings in your `package.json` by adding the following section:

```json
  "coverage": {
    "threshold": 100,
    "projectName": "Istanbul Slack Notify",
    "repositoryUrl": "https://github.com/mattyboy/istanbul-slack-notify",
    "coverageFiles": ["coverage/coverage-final.json"],
    "username": "coverage-bot",
    "channel": "#random"
  }
```

Istanbul / Jest coverage report for your project must be generated first. 

## Examples
<a name="examples"></a>

### Via npm task
<a name="example-npm"></a>

**Passing SLACK_WEBHOOK at runtime**

Define a couple of npm tasks in `package.json`, assuming you only want slack notify from you CI server.
```json
"test": "./node_modules/.bin/jest --coverage",
"test-ci": "npm test && ./node_modules/.bin/istanbul-slack-notify",
```

Then run tests on your CI server as follows.

```bash
export SLACK_WEBHOOK=https://hooks.slack.com/xxxxx
SLACK_WEBHOOK=$SLACK_WEBHOOK npm run test-ci
```

**Defining SLACK_WEBHOOK in package.json**

While you can do this be sure it isn't in a public repo as you will expose your slack webhook url.

```json
"test": "./node_modules/.bin/jest --coverage",
"test-ci": "npm test && SLACK_WEBHOOK=https://hooks.slack.com/xxxxx ./node_modules/.bin/istanbul-slack-notify",
```

### Via cli
<a name="example-cli"></a>

```bash
export SLACK_WEBHOOK=https://hooks.slack.com/xxxxx
SLACK_WEBHOOK=$SLACK_WEBHOOK ./node_modules/.bin/istanbul-slack-notify
```

## Contributing
<a name="contributing"></a>

If you have any feedback or suggestions please let me know. We use this package as part of our CI process and 
are open to changes that would be valuable to us and others. 