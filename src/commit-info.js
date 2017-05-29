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
                "refs": "%d"
            });
            let command = `git log -1 --no-color --decorate=short --pretty=format:'${format}' HEAD`;
            exec(command, (err, stdout, stderr) => {
                if (err) {
                    err.stderr = stderr;
                    return reject(err);
                }
                let commitInfo = JSON.parse(stdout);
                commitInfo.refs = this.fixGitRefs(commitInfo.refs);
                return resolve(commitInfo);
            })
        });
    }

    static fixGitRefs(rawString) {
        let refs = rawString;
        refs = refs.trim();
        refs = refs.replace("(", "");
        refs = refs.replace(")", "");
        return refs.split(", ");
    }
}

module.exports = CommitInfo;