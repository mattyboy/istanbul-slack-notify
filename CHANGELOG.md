## 2.0.1 (December 4, 2024)

Below is a list of what has changed. Has been upgraded to run with later version of Node (20+) and moved to use
nyc dependency (istanbul is deprecated).

## Breaking Changes

### Node Version and Dependencies

Upgraded project to use Node 21 as base version. GitHub action tests on node 20 and 21. So will work Node 20+

Remove dependency on `istanbul` and replaced with `nyc`. Upgraded all other dependencies to latest version.

### Coverage Settings

This version generates the NYC summary on the fly and as a result the settings for the notifier have changed:

Previously:
```json
{
  "rootDir": "./",
  "coverageFiles": ["coverage/coverage-final.json"],
  "summaryFile": "coverage/coverage-summary.json",
  "threshold": 80
}
```

Now becomes:
```json
{
  "coveragePath": "./coverage",
  "threshold": 80
}
```

The `rootDir`, `coverageFiles` are replaced by setting `coveragePath` to the location you output 
coverage reports to. (default: `./coverage`). The `summaryFile` is no longer required as summary is generated at run 
time based using nyc and the provided `coveragePath` files.

### Moved to using `modules` instead of `commonjs`

Updated the overall structure to use modules. If this is undesirable please let me know and I can reconsider this change.

