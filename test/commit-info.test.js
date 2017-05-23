const CommitInfo = require("../src/commit-info");
const {exec} = require('child_process');

jest.mock('child_process');

test('git', () => {
    exec.mockImplementationOnce((cmd, cb) => {
        expect(cmd).toEqual(expect.stringMatching(/^git log.*HEAD$/));
        const stdout = JSON.stringify({
            "shortRevision": "shortRevision",
            "revision": "revision",
            "date": "date",
            "subject": "subject",
            "author": "author",
            "authorEmail": "authorEmail",
            "refs": "ref0, ref1"
        });
        cb(null, stdout, '');
    });

    expect.assertions(9);
    return CommitInfo.git().then(data => {
        expect(data.shortRevision).toBe("shortRevision");
        expect(data.revision).toBe("revision");
        expect(data.date).toBe("date");
        expect(data.subject).toBe("subject");
        expect(data.author).toBe("author");
        expect(data.authorEmail).toBe("authorEmail");
        expect(data.refs.length).toBe(2);
        expect(data.refs[0]).toBe("ref0");
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
