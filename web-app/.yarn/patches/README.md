# Development SDK compatibility

The `minio@8.0.7` patch lets the browser test SDK use `stream-json@3.5.0`,
which fixes [GHSA-528h-pc64-c93x](https://github.com/advisories/GHSA-528h-pc64-c93x).
The SDK's JSONL parser moved from `jsonl/Parser.js` and `.make()` to
`jsonl/parser.js` and `.asStream()`. The patch updates that import and factory
in the source, CommonJS and ESM builds. The `{ key, value }` output is unchanged.

This SDK is a development dependency and is not bundled into Console. Its
CommonJS build requires Node 22 or later to load the parser's ESM module; the
test and build environment uses Node 24. The notification compatibility tests
exercise both SDK builds with fragmented JSONL and malformed input.

Remove the patch when an upstream SDK release supports the fixed parser.
