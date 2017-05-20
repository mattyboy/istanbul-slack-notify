const BuildInfo = require("../src/build-info");
const git = require("git-rev");

// mock git module using jest
git.branch = jest.fn((cb) => {
    return cb("master");
});

git.long = jest.fn((cb) => {
    return cb("revision");
});

test('git', () => {
    const buildInfo = BuildInfo.git();
    return buildInfo.then(data => {
        expect(data.branch).toBe("master");
        expect(data.revision).toBe("revision");
    });
});

test('git - branch error', () => {
    git.branch.mockImplementationOnce(() => {
        throw Error("git branch error");
    });
    const buildInfo = BuildInfo.git();
    return buildInfo.catch(e =>
        expect(e.message).toMatch('git branch error')
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
