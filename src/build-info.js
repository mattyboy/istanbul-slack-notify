const Promise = require("es6-promise").Promise;
const git = require("git-rev");

class BuildInfo {

    static git() {
        return new Promise((resolve, reject) => {
            let shortRev = new Promise((resolve, reject) => {
                try {
                    git.short(resolve);
                } catch (e) {
                    reject(e);
                }
            });
            let longRev = new Promise((resolve, reject) => {
                try {
                    git.long(resolve);
                } catch (e) {
                    reject(e);
                }
            });

            Promise.all([shortRev, longRev])
                .then(values => {
                    resolve({
                        shortRevision: values[0], revision: values[1]
                    });
                })
                .catch(e => {
                    reject(e);
                });
        });
    }
}

module.exports = BuildInfo;
