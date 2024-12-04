import {exec} from "node:child_process";

export default class CommitInfo {
  static git() {
    return new Promise((resolve, reject) => {
      exec(this.gitCommand(), (err, stdout, stderr) => {
        if (err) {
          err.stderr = stderr;
          return reject(err);
        }
        let commitInfo = this.formatToJson(stdout);
        return resolve(commitInfo);
      });
    });
  }

  /**
   * @returns {string} git command
   */
  static gitCommand() {
    const gitFormat = ["%h", "%H", "%cr", "%f", "%an", "%ae", "%d"].join("$$$");
    return `git log -1 --no-color --decorate=short --pretty=format:'${gitFormat}' HEAD`;
  }

  static formatToJson(data) {
    const gitData = data.split("$$$");
    const refsFixed = this.fixGitRefs(gitData[6]);
    return {
      shortRevision: gitData[0],
      revision: gitData[1],
      date: gitData[2],
      subject: gitData[3],
      author: gitData[4],
      authorEmail: gitData[5],
      refs: refsFixed,
    };
  }

  static fixGitRefs(rawString) {
    let refs = rawString;
    refs = refs.trim();
    refs = refs.replace("(", "");
    refs = refs.replace(")", "");
    return refs.split(", ");
  }
}
