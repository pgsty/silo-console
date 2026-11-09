# UI localization

English source text is the key and the only fallback. The default is English,
independent of browser language. Saved preferences use the `language` storage
key; `zh` remains valid and the early Portuguese value `pt` migrates to `pt-BR`.

`locales.ts` contains the language metadata and static catalog mapping. Each
language supplies its autonym, BCP 47 formatting tag, direction and maintenance
tier. Set `enabled: false` to keep an unfinished language out of selection and
stored-preference validation. Add its three literal TypeScript dictionaries
under `locales/<id>/`: `chrome.ts`, `help.ts`, and `screens.ts`; import them and
add the language to `LOCALES` and `CATALOGS` in the registry. Type checking requires
the two maps to contain the same languages.

All dictionaries are bundled statically in the cached `languages` asset. The
three files organize translation work; they are not loading phases. Their
precedence is chrome > screens > help. Language switching is synchronous and
works offline after the application has loaded. There are no locale fetches,
loading states, timers, retry loops or additional runtime dependencies. The
bundle budget explicitly includes all ten languages and still bounds unrelated
application and vendor chunks separately.

Use `t()` for UI strings and `i18nKey()` for strings translated later. Use
`tn(count, one, other)` for quantities; translated plural objects live under the
English plural key and include every category returned by `Intl.PluralRules`.
Do not translate API error payloads, log messages, object names, paths, policy
JSON, protocol identifiers, or arbitrary user data. Their surrounding UI labels
can be translated. Preserve identifiers in translated help text too.

Chinese is first-party maintained: the source coverage test blocks missing keys.
Other languages may fall back to English while being updated; missing copy is
reported without failing CI. Invalid placeholders, plural forms, partitions,
duplicate keys, registry entries or locale tags fail validation. Existing
Chinese orphan/duplicate baselines are historical exceptions, not templates for
adding new exceptions. Keep new keys in the same partition in every language.

```sh
yarn i18n:report
yarn i18n:report --json > /tmp/silo-missing-translations.json
yarn i18n:rename 'Old English key' 'New English key'        # dry run
yarn i18n:rename 'Old English key' 'New English key' --write
yarn exec playwright test --project=unit e2e/i18n-coverage.unit.ts e2e/locale-catalogs.unit.ts e2e/i18n-runtime.unit.ts e2e/languages-browser.unit.ts --reporter=line
```

The report includes Chinese reference text, partitions and source locations for
missing translations. Key migration preserves translated values, rejects
placeholder changes and existing destination keys; review the diff and run
coverage afterward. Catalogs are read as literal data without executing code.

French, German, Spanish, Russian, Japanese, Arabic and Turkish use AI-assisted
translation drafts, revised with UI context, the glossary, plural forms and
review of destructive-operation copy. Drafting tools and translation services
are not application or build dependencies. Native-speaker corrections are
welcome, especially for longer help passages; complete key coverage does not
claim native linguistic review. Brazilian Portuguese originates in Eduardo
Andrade Machado's [PR #83](https://github.com/pgsty/silo-console/pull/83), with
its authorship and notices retained. Turkish addresses
[silo#277](https://github.com/pgsty/silo/issues/277). See [GLOSSARY.md](GLOSSARY.md).

For development layout checks, append `?pseudo=en-XA` (expanded accented English)
or `?pseudo=ar-XB` (expanded RTL) to a page. These are development-only fixtures,
never menu entries or production catalogs. Real-language browser tests cover
350, 768 and 1440 px, keyboard selection, persistence, offline switching,
unsaved forms and raw-data isolation. RTL layout uses logical CSS;
viewport coordinates, chart geometry and protocol data remain physical/LTR.
