/**
 * Handles process response on completion of coverage checks
 */
export default class ProcessResponder {
  static respond(settings) {
    if (!settings.project.coverage.success && settings.haltOnFailure) {
      return Promise.reject(new Error("Coverage Check Failed & Halt On Failure Set. Exiting."));
    }
    return Promise.resolve(0);
  }
}
