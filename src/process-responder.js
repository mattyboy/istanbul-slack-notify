const Promise = require("es6-promise").Promise;

class ProcessResponder {
    static respond(settings) {
        if (!settings.project.coverage.success && settings.haltOnFailure) {
            Promise.reject(new Error("Coverage Check Failed & Halt On Failure Set. Exiting."));
        } else {
            Promise.resolve(0);
        }
    };
}