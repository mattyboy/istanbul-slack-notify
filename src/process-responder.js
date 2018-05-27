const Promise = require("es6-promise").Promise;

class ProcessResponder {
    static respond(settings) {
        if (!settings.project.coverage.success && settings.haltOnFailure) {
            return Promise.reject(new Error("Coverage Check Failed & Halt On Failure Set. Exiting."));
        }
        return Promise.resolve(0);
    }
}

module.exports = ProcessResponder;