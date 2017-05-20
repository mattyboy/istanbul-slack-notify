const BuildInfo = require("../src/build-info");
const git = require("git-rev");

// mock git module using jest
git.short = jest.fn((cb) => {
    return cb("shortRevision");
});

git.long = jest.fn((cb) => {
    return cb("revision");
});

test('git', () => {
    const buildInfo = BuildInfo.git();
    return buildInfo.then(data => {
        expect(data.shortRevision).toBe("shortRevision");
        expect(data.revision).toBe("revision");
    });
});

test('git - short revision error', () => {
    git.short.mockImplementationOnce(() => {
        throw Error("git short revision error");
    });
    const buildInfo = BuildInfo.git();
    return buildInfo.catch(e =>
        expect(e.message).toMatch('git short revision error')
    );
});

test('git - revision error', () => {
    git.long.mockImplementationOnce(() => {
        throw Error("git revision error");
    });
    const buildInfo = BuildInfo.git();
    return buildInfo.catch(e =>
        expect(e.message).toMatch('git revision error')
    );
});
