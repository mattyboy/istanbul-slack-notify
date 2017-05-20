# istanbul-slack-notify

[![Build Status](https://travis-ci.org/mattyboy/istanbul-slack-notify.svg?branch=master)](https://travis-ci.org/mattyboy/istanbul-slack-notify) 
[![Coverage Status](https://coveralls.io/repos/github/mattyboy/istanbul-slack-notify/badge.svg?branch=master)](https://coveralls.io/github/mattyboy/istanbul-slack-notify?branch=master)

Sends istanbul / jest coverage summary and git build details to Slack using a pass/fail threshold for project coverage.

![screenshot](https://raw.githubusercontent.com/mattyboy/istanbul-slack-notify/master/screenshot.png "Message example")

## Install

```
npm i --save-dev istanbul-slack-notify
```

## Before You run

**Do not share incoming webhook URLs in public code repositories.**

You will need to configure a webhook for your Slack team: https://api.slack.com/incoming-webhooks

You must define `SLACK_WEBHOOK` as an environment variable.

You can override other default settings in your `package.json` by adding the following section:

```json
  "coverage": {
    "coverageFiles": ["coverage/coverage-final.json"],
    "threshold": 100,
    "channel": "#random",
    "username": "coverage-bot",
    "projectName": "Istanbul Slack Notify",
    "repositoryUrl": "https://github.com/mattyboy/istanbul-slack-notify"
  }
```

Istanbul / Jest coverage report for your project must be generated first. 

## Run

Inside Your project root directory You can use on of following run sequence.

### Via npm task

```json
"test": "jest --coverage && ./node_modules/.bin/istanbul-slack-notify"
```