const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
};

class Slack {
    setWebhook(url) {
        this.webhookUrl = url;
    }

    webhook(payload, callback) {
        if (this.webhookUrl.indexOf("error") > -1) {
            callback("fake error was thrown", payload);
        } else if (this.webhookUrl.indexOf("timeout") > -1) {
            sleep(100).then(() => {
                callback("timeout occurred", payload);
            });
        } else {
            callback(null, payload);
        }
    }
}

module.exports = Slack;