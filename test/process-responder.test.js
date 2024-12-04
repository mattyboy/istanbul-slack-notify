import ProcessResponder from "../src/process-responder";
import {expect, test} from "@jest/globals";
import {project} from "./constants";

const failProject = Object.assign(project, {coverage: {success: false}});

test("If coverage fails, but not halt, resolve 0", () => {
  const settings = Object.assign({haltOnFailure: false}, {project: failProject});
  return ProcessResponder.respond(settings).then(result => expect(result).toBe(0));
});

test("If coverage fails, and halt is true, reject", () => {
  const settings = Object.assign({haltOnFailure: true}, {project: failProject});
  return ProcessResponder.respond(settings).catch(error => {
    expect(error).toBeDefined();
  });
});

test("If coverage succeeds, and not halt, resolve 0", () => {
  const settings = Object.assign({haltOnFailure: false}, {project});
  return ProcessResponder.respond(settings).then(result => expect(result).toBe(0));
});

test("If coverage succeeds, and halt is true, still resolve 0", () => {
  const settings = Object.assign({haltOnFailure: true}, {project});
  return ProcessResponder.respond(settings).catch(error => {
    expect(error).toBeDefined();
  });
});
