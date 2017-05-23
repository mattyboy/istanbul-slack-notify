const Promise = require("es6-promise").Promise;
const {exec} = require('child_process');

class CommitInfo {

    static git() {
        return new Promise((resolve, reject) => {
            let format = JSON.stringify({
                "shortRevision": "%h",
                "revision": "%H",
                "date": "%cr",
                "subject": "%f",
                "author": "%an",
                "authorEmail": "%ae",
                "refs": "%D"
            });
            let command = `git log -1 --no-color --decorate=short --pretty=format:'${format}' HEAD`;
            exec(command, (err, stdout, stderr) => {
                if (err) {
                    err.stderr = stderr;
                    return reject(err);
                }
                let commitInfo = JSON.parse(stdout);
                commitInfo.refs = commitInfo.refs.split(", ");
                return resolve(commitInfo);
            })
        });
    }

}

module.exports = CommitInfo;