# Browser downloads, recovery and UI text

Multi-selection ZIPs use a file writer when the browser offers the File System
Access API. The response is streamed with backpressure, and cancelling a queued
or active transfer aborts the request and file writer. A failed or incomplete
stream never closes the writer as a completed file. Progress is determinate only
when the response supplies a reliable content length; recursive ZIPs normally
have no such total. A file-size sum is not a ZIP content length.

Other browsers submit a same-origin native download form to the existing ZIP
operation. The normal Console authentication, anonymous access and server ZIP
error behavior remain in effect. The browser download manager owns progress,
cancellation and network errors. Console shows this handoff explicitly instead
of reporting a completed 100% archive. Dismiss the transfer entry before starting
the same selection again; doing so does not cancel an already handed-off browser
download. Use the browser download manager to cancel it.

Selections above **5 GiB**, or with unknown total size, display a recommendation
to use `mcli` for long-running transfers. No multi-selection path buffers the
complete archive in JavaScript. Native form requests are bounded to the current
page's maximum 1,000 selections and a 2 MiB encoded request; this bounds the
selection description, not the size of the downloaded archive. Individual
bounded object downloads retain their existing XHR path.

Invalid percent encoding produces the localized not-found screen before route
components run. Valid Unicode and encoded literal percent/slash characters are
still decoded exactly once by the existing object identity helpers. Invalid
stored sidebar values fall back to an open sidebar. Blocked storage does not
prevent reading the default language/theme or changing them for the session.
The root render boundary offers reload and home actions without clearing any
preferences, credentials or unrelated local storage.

UI prose uses the existing English-keyed `useT`/`translate` dictionaries. Icon
controls require explicit localized accessible names. Console tooltips support
focus, Escape dismissal, hover and `aria-describedby`; labels do not depend on
tooltip visibility. The MDS sign-out control lacks a label prop, so its actual
text and accessible name are localized after rendering, with no CSS-generated
replacement text.

`web-app/hack/ui-source-guard.mjs` runs with the frontend unit suite and inventories
literal JSX text and icon controls. Its explicit exclusions are protocol/API and
command tokens, product/legal names, the typed confirmation token, version/unit
notation and the internal component/icon catalogues. Raw object names and log
payloads remain untouched. New prose must go through translation rather than be
added to the exclusion set. English/Chinese browser rendering and navigation
checks supplement the source guard.
