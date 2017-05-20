const IstanbulReport = require("../src/istanbul-report");

const settings = {
    rootDir: process.env.PWD,
    coverageFiles: ["test/coverage-final.json"],
    summaryFile: "test/coverage-summary.json",
    threshold: 20.52
};

beforeEach(() => {
    settings.coverageFiles = ["test/coverage-final.json"];
    settings.summaryFile = "test/coverage-summary.json";
});

test('constructor', () => {
    const report = new IstanbulReport();
    expect(report.settings.coverageFiles[0]).toBe("coverage/coverage-final.json");
    expect(report.settings.summaryFile).toBe("coverage/coverage-summary.json");
    expect(report.settings.rootDir).toBe("./");
    expect(report.settings.threshold).toBe(80);
});

test('constructor - threshold above 100', () => {
    const report = new IstanbulReport({threshold: 120});
    expect(report.settings.threshold).toBe(100);
});

test('constructor - threshold below 0', () => {
    const report = new IstanbulReport({threshold: -20});
    expect(report.settings.threshold).toBe(0);
});

test('generateSummary - no coverage files', () => {
    settings.coverageFiles = [];
    expect(() => {
        new IstanbulReport(settings)
    }).toThrowError("Require at least one coverage istanbul file (settings.coverageFiles)");
});

test('generateSummary - with settings', () => {
    const report = new IstanbulReport(settings);
    expect(report.settings).toBe(settings);
});

test('generateSummary', () => {
    const report = new IstanbulReport(settings);
    expect.assertions(1);
    return expect(report.generateSummary()).resolves.toBeUndefined();
});

test('generateSummary - coverage file is missing', () => {
    settings.coverageFiles = ["test/no-such-file.json"];
    const report = new IstanbulReport(settings);
    expect.assertions(1);
    return report.generateSummary().catch(e =>
        expect(e.message).toMatch('Error reading coverage files. Generate istanbul report(s) first')
    );
});

test('processSummary - summary file is missing', () => {
    settings.summaryFile = "test/no-such-file.json";
    const report = new IstanbulReport(settings);
    expect.assertions(1);
    return report.processSummary().catch(e =>
        expect(e.message).toMatch(`Error processing file: ${settings.summaryFile}`)
    );
});

test('processSummary', () => {
    const report = new IstanbulReport(settings);
    return report.processSummary().then(data => {
        expect(data.branches).toBe(18.75);
        expect(data.functions).toBe(50);
        expect(data.lines).toBe(52.24);
        expect(data.statements).toBe(53.62);
        expect(data.project).toBe("43.65");
        expect(data.threshold).toBe(settings.threshold);
        expect(data.success).toBe(true);
    });
});
