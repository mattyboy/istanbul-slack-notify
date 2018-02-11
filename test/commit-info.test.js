const CommitInfo = require("../src/commit-info");
const {exec} = require('child_process');

jest.mock('child_process');

const TEST_STDOUT = ["shortRevision", "revision", "date", "subject", "author", "authorEmail", " (HEAD, origin/master, origin/HEAD, master)"];

test('git', () => {
    exec.mockImplementationOnce((cmd, cb) => {
        expect(cmd).toEqual(expect.stringMatching(/^git log.*HEAD$/));
        cb(null, TEST_STDOUT.join("$$$"), '');
    });

    expect.assertions(10);
    return CommitInfo.git().then(data => {
        expect(data.shortRevision).toBe("shortRevision");
        expect(data.revision).toBe("revision");
        expect(data.date).toBe("date");
        expect(data.subject).toBe("subject");
        expect(data.author).toBe("author");
        expect(data.authorEmail).toBe("authorEmail");
        expect(data.refs.length).toBe(4);
        expect(data.refs[0]).toBe("HEAD");
        expect(data.refs[1]).toBe("origin/master");
    });
});

test('git - error', () => {
    exec.mockImplementationOnce((cmd, cb) => {
        cb(new Error("mock command error"), 'stdout', 'stderr');
    });
    expect.assertions(2);
    return CommitInfo.git().catch(error => {
        expect(error.message).toBe("mock command error");
        expect(error.stderr).toBe("stderr");
    });
});
