# Vendored MinIO Design System

- Upstream: <https://github.com/georgmangold/mds>
- Version: `1.1.5.9`; local workspace version: `1.1.5.9-silo.0`.
- Requested upstream revision: `b66d0b06272ae88e3975248691799a1cb0b4d6de`.
  This is the annotated `v1.1.5.9` tag object, which peels to commit
  `d4befa1b7dc525619e378742fe923141972fa78e` (2026-04-08).
- Vendored: 2026-10-23.
- License: AGPL-3.0-or-later. `LICENSE` is copied unchanged. Existing source
  copyright and license headers are preserved. The initially vendored Inter
  font files and their license were removed in T06a; the UI uses system fonts.

Before vendoring, a recursive comparison of the checked-out upstream `src/`
against the installed, Yarn-patched MDS `src/` found exactly one changed file:
`components/DropdownSelector/DropdownSelector.tsx`.

## Local modifications

1. `src/components/DropdownSelector/DropdownSelector.tsx`: retain Console's
   click-index fix. A mouse click or tap selects the clicked option's index;
   keyboard Enter defaults to the highlighted index. Disabled options keep their
   existing behavior. Regression tests are in `../../e2e/mds-select.unit.ts` and
   bundle this workspace's source.
2. `src/components/index.ts`: re-export `SelectorType` with `export type` for the
   application's `isolatedModules` setting. All retained source is checked by
   the app's strict TypeScript configuration, including its React 18.3 types.
   No compiler options are relaxed and no separate MDS build or tsconfig is needed.
3. `src/components/GlobalStyles/GlobalStyles.tsx` and
   `src/components/LoginWrapper/LoginWrapper.tsx`: replace asset imports with the
   same relative URL strings emitted by upstream's Rollup URL plugin. This keeps
   font and background URLs unchanged and avoids emitting duplicate hashed files
   when Vite compiles the source. The nine retained WOFF2 faces are copied byte-for-byte
   from upstream `src/components/assets/` to `assets/`, preserving the paths
   previously emitted under `dist/assets/`. The font license is retained but is
   excluded from the runtime static-copy glob.
4. `package.json`: private ESM Yarn workspace, with the sole export and `types`
   pointing to `src/index.ts`. Runtime packages reuse Console's existing locked
   versions. `lodash` is a runtime dependency here (upstream classified it as a
   development dependency despite runtime imports). `react-is` supplies
   styled-components' peer dependency. React and React DOM remain peers, also
   supplied as development dependencies for workspace checking. Type packages
   are development dependencies, using Console's React 18 versions.
5. `src/components/Menu/`: add expanded/collapsed React-node logo slots,
   optional `applicationLogo`, translated sign-out/collapse/expand labels,
   native keyboard-accessible collapse buttons, and a focus-visible ring.
   Collapsed item names stay accessible without application DOM patches.
   Custom logo slots use a 72px rail; legacy logos retain 80px. Console explicitly
   retains its baseline 80px rail until its responsive shell adopts the new size.
   Width-only transitions avoid viewport-height animation and respect reduced
   motion. Horizontal and legacy mobile headers accept the same logo/sign-out
   overrides. `MenuItem.tsx` and `src/global/global.types.ts` add the optional
   `menu.vertical.activeIndicatorColor` (3px inset left bar, no default change).
6. `src/components/Menu/Menu.tsx` and `MobileMenu/MobileDrawer.tsx`: add opt-in
   `mobileMode="auto"` below 768px, defaulting to desktop behavior (`"never"`).
   The controlled `mobileOpen`/`onMobileOpenChange` drawer uses a native modal
   dialog, backdrop, Escape/navigation dismissal, focus trapping/restoration,
   scroll locking and reduced motion. `mobileLabel` labels the dialog (default
   `"Menu"`). The deprecated, explicitly supplied `mobileModeAuto` API keeps its
   original mobile-header implementation; explicit `mobileMode` takes priority.
   Media-query listeners are initialized on mount and cleaned up on unmount.
7. `src/components/DataTable/`: add optional `priority` column metadata with CSS
   hiding for medium (<768px) and low (<1200px), including headers. Cells stay
   mounted, and flexible columns share the released space. These thresholds are
   intentionally separate from the legacy MDS grid breakpoints. `emptyState`
   overrides `customEmptyMessage`/the built-in message when supplied. New
   `sortConfig={field, direction}` plus `onSortChange(field, direction)` is a
   controlled, caller-ordered API and takes precedence over `sortEnabled`.
   Legacy boolean/array/manual `sortEnabled`, `sortCallBack`, and `ISortConfig`
   remain supported. Sortable headers use native buttons; the columnheader
   carries `aria-sort`. `DataTable.logic.ts` contains the pure breakpoint and
   sort-toggle rules.
8. `src/components/Button/`, `IconButton/`, and `Tooltip/`: opt-in
   `disabledReason` uses a shared focusable tooltip wrapper with a stable
   `aria-describedby` description. The disabled button keeps its native disabled
   state and yields pointer events to the wrapper. Other buttons retain their
   original markup. Tooltips now support focus, Escape dismissal, `role="tooltip"`
   and optional `wrapperProps`; full-width disabled buttons retain their width.
   Tooltips opened inside a native dialog stay in that dialog's top layer.
9. `src/components/PageHeader/`: optional `menuToggle` slot precedes the label.

10. Fluid Functionalism foundation (T06a): remove the bundled Inter font faces,
    their `GlobalStyles` font declarations and static-copy target. `GlobalStyles`,
    Button, CommentBox, CodeEditor, Tag, Table cells and both Menu variants use
    the application system sans/mono font tokens. The remaining Chakra Petch
    login display assets are owned by the application and are unchanged.
11. `src/global/SurfaceLevel.tsx` and `src/index.ts`: export substrate context,
    bounded level calculation and the `Elevated` helper. Box cards establish
    surface 3 and reset the local secondary text role. Opaque DataTable roots
    reuse Box with a background, while `noBackground` tables preserve their
    enclosing substrate and text-role variables. ModalBox uses substrate + 4 /
    shadow 5; DropdownSelector and
    Tooltip use substrate + 2 / shadow 3 (tooltips retain inverted colors).
    React context is retained through portals. Shared `designScale`, typography
    and `Density` modules are owned by MDS and re-exported by the app;
    `Elevated` reapplies density variables at portal roots. The scale has one
    source and MDS never imports application code. Bordered Box/DataTable containers
    use surface 3, hairline shadow 2 and 12px corners instead of drawn borders.
    Outlined Tag text/icons use foreground, because the neutral tag background
    tint is no longer a readable text color.
12. Menu vertical chrome: neutral token backgrounds, 36px rows, 16px icons,
    a hidden semibold label copy to reserve active-label width, caption group
    labels and hairline dividers. Console sets a 64px rail via a token; the
    standalone custom-logo rail retains its 72px fallback. Width animation is
    removed to avoid animating layout properties. PageHeader and PageLayout
    use the shared title/spacing roles; Tooltip/ModalBox motion uses CSS tokens.
    No icon glyphs, dependency versions or login hero artwork are changed.

13. Control craft (T06c): Button and IconButton use the shared density/type roles
    and a fixed 1px inset inner surface. A same-color 1px spread collapses on
    press without scaling text or changing the layout box. Loading retains label
    width. Legacy `regular`, `callAction`, `subAction`, and `text` map to outline,
    primary, secondary, and ghost; `secondary` now means neutral tint. Explicit
    danger/danger-fill variants keep destructive call sites separate from
    ordinary actions. Icon glyphs are unchanged.
14. InputBox, CommentBox, Select trigger and Autocomplete chrome share a compact
    field helper with focus/error/disabled states and coarse-pointer 16px text.
    Checkbox/Switch/RadioGroup keep keyboard-operable native inputs, token state
    visuals, reduced motion and density. Tags use 24/20px pills with tinted or dot
    status treatment. ControlLabels supplies localized internal action names
    without importing application modules. Input error captions are described by
    their fields; password/action icons remain aligned to the field itself.
15. Tooltip uses a 200ms pointer delay, 300ms group skip window, 60ms retained
    exit and immediate keyboard focus entry. It retains native-dialog portal
    targets and disabled-reason wrappers. ModalBox applies typography on its
    actual elevated panel, supports 400/540/880px widths (360/480/800 compact),
    title icon semantics, 240ms entry and 160ms exit. Closing portals become
    inert immediately. A shared stack owns nested Escape, portal-aware focus,
    opener restoration and body scroll locking, including out-of-order unmount.
    `useModalActive` lets app shortcut providers subscribe to the live stack.
    A small presence context closes nested portals while app lazy presence
    boundaries retain valid nullable business payloads for their exit.
16. Banner provides low/high contrast callouts; HelpBox retains its content while
    adopting that primitive. Snackbar uses an inverted surface, preserves its
    condensed caption mode, pauses on hover/focus and retains its 60ms exit.
    Progress uses a 6px track and transform animation; reduced motion stops the
    spinner/indeterminate movement. These are independent styled-components
    implementations informed by Fluid Functionalism's MIT reference, with no
    new runtime, UI or animation dependency. Browser regressions are in
    `../../e2e/ff-controls.unit.ts`.

Extension-point regressions are covered by `../../e2e/mds-table.unit.ts` (pure
rules) and `../../e2e/mds-extensions.unit.ts` with its source-bundled browser
harness (keyboard, controlled and legacy sort, responsive cells, empty state,
disabled reasons, active indicator and modal drawer).

The app resolves MDS through this package's exports without an alias or dist
bundle. `../../tsconfig.json` explicitly includes `packages/mds/src`.
`../../.prettierignore` skips the vendored source/assets/license to preserve
readable upstream diffs; the manifest and this file are formatted normally.
`../../knip.config.ts` treats each retained MDS source module as a library entry,
so unused library exports/modules are retained. Dependency and import checks
remain enabled, and the application retains its existing dead-code checks.
The existing named/default export pairs in `HelpTip.tsx` and `FieldContainer.tsx`
are exempted from Knip's duplicate-export check to preserve the upstream API.

## Files not vendored

Only the runtime source, runtime assets and legal notices are brought into this
package. In particular:

- All 55 `src/**/*.stories.tsx` files.
- `src/utils/StoryThemeProvider.tsx` (used only by Storybook).
- `src/utils/TestIcon.tsx` (used only by stories and the Jest test).
- `src/components/Button/__tests__/Button.test.tsx` (the upstream Jest test).
- `.storybook/`, `jest.config.js`, Babel/TypeScript/Rollup build configuration,
  upstream package/lock files, CI configuration, generated `dist/`, Storybook
  `docs/`, and other repository tooling/documentation. None is imported by
  runtime code. This package has its own manifest and provenance document.
- `src/components/assets/` is relocated rather than duplicated. Only the nine
  Inter WOFF2 files present in upstream `dist/assets/` are copied, plus
  `fonts/Inter/OFL.txt`. The WOFF fallbacks, `background/background.jpg`,
  `background/loginAnimationPoster.png`, variable Inter fonts and the unused
  ExtraBold, ExtraLight, Medium, SemiBold and ThinItalic faces are omitted.

## Comparing or updating upstream

Run from the repository root; use a scratch checkout outside the repository:

```sh
git clone https://github.com/georgmangold/mds.git /tmp/mds-upstream
git -C /tmp/mds-upstream checkout b66d0b06272ae88e3975248691799a1cb0b4d6de
git -C /tmp/mds-upstream rev-parse HEAD
# Expect d4befa1b7dc525619e378742fe923141972fa78e.
diff -ru --exclude='*.stories.tsx' --exclude='__tests__' \
  --exclude='utils' --exclude='assets' \
  /tmp/mds-upstream/src web-app/packages/mds/src
cmp /tmp/mds-upstream/LICENSE web-app/packages/mds/LICENSE
# Compare retained assets individually; unused upstream assets are listed above.
find web-app/packages/mds/assets -type f | while IFS= read -r file; do
  cmp "/tmp/mds-upstream/src/components/assets/${file#web-app/packages/mds/assets/}" "$file"
done
```

The shared `Elevated` root also selects a contrast-safe contextual secondary-text
value on surfaces 7–8, resets it on lower nested surfaces, and rebinds legacy text
aliases so both app and MDS descendants inherit it through portals. Base FF tokens
remain unchanged; the console supplies a central elevated-muted semantic token.

The source diff should contain only modifications 1–3 and 5–16 above. Update this file
when changing vendored code. Re-run strict type checking, the DropdownSelector
browser regression tests, production builds, static asset parity and frontend
credits checks after an update. Do not reintroduce prebuilt MDS bundles or a
separate MDS build step.

Fluid list craft (T06b) adds a list-local measured hover store, CSS compositor
highlight, guarded gap activation, keyboard navigation and portal presence helpers.
Menu, DropdownSelector, ColumnsSelector, DataTable and Tabs use these primitives;
Tabs keep manual activation and a separate measured selected overlay. DataTable
retains react-virtualized and its existing selection/action contracts. Original
icons are unchanged. The implementation follows the attributed FF interaction
specification without adding its animation dependencies.

T06c integration retains T06b's public lazy DropdownSelector boundary and its
option-value focus repair. Select now has a native button trigger; Autocomplete
keeps focus on its combobox input with the popup's local keyboard/active-descendant
API. Popup and tooltip portals consume modal presence, so retained exits are
inert when a parent closes. The application Tooltip entry point delegates to MDS;
an invisible side-offset bridge preserves hoverability without changing the
200 ms entry / 300 ms skip / 60 ms exit contract. Modal activity is exposed as a
subscription for the app shortcut provider, without importing app code into MDS.

- T11: add the optional `DataTable.loadingState` slot, which replaces the default loading message and spinner. Loading takes precedence over records and `emptyState`; the table container exposes `aria-busy`. Existing callers retain their default loading view. The select-all checkbox reflects every visible record even when selections are retained outside the current filter.

### T13 navigation integration

- `MenuItem` accepts opt-in `inlineChildren` for recent links under a navigable parent; existing collapsible groups retain their behavior. `VerticalMenu` forwards the option.
- Active group expansion depends on the active child path or explicit `selected` group instead of the children array identity, so normal rerenders do not reopen a manually collapsed group. The application uses its registry section for detail routes without a visible menu path. Path matching respects segment boundaries. Long labels retain their semibold width reservation and ellipsize inside the sidebar.
- Collapsed-rail span alignment preserves the native `[hidden]` state of tooltip descriptions without changing the logo selectors' specificity.

### Shared header polish

- `PageHeader` uses a 56px minimum height, responsive 24/16/12px inline padding and content-sized flex regions. Action spacing is owned by its immediate flex row; the old descendant-button margin rule is removed so nested help/menu controls retain their own layout. Existing label, middle, action, menu-toggle and class hooks are preserved.

### T21 object keyboard integration

- `DataTable.interaction` is an opt-in contract for caller-owned active identity,
  keyboard/mouse actions, row labels, a persistent list ref and explicit scroll/focus
  requests. It retains react-virtualized and default table behavior. Opted-in rows
  and the fallback wrapper share one tab stop based on mounted row identity,
  including overscan; row checkboxes stay mouse-operable. Stable row refs report
  actual removal to popup owners and recover focus only after removal. Scroll requests are cleared after focus so
  pointer scrolling and resize do not retain an old scroll target.
- `Box.elementRef` optionally exposes its owned div. DataTable uses it for the
  interaction root without adding any wrapper or changing the legacy DOM layout.
- `useListPopup` accepts optional point geometry paired with its existing real
  HTMLElement anchor. The anchor still owns containment, connection and focus;
  default trigger placement is unchanged. Popup size observation repositions
  asynchronous contents. Application context menus use the same
  popup presence and motion helpers. Regressions are in
  `../../e2e/object-keyboard.unit.ts` and the explicit GUI spec/config.

### T18 responsive integration

- `ModalBox` accepts an opt-in inline presentation with one stable portal host.
  Moving that host retains the child owner and focused descendant. Nested modal
  ancestry determines stack and paint order; presentation changes do not run
  actual-close focus restoration. `restoreFocusTo` lets the app supply its
  active-row/list fallback. Default modal callers retain their lifecycle.
- `MobileDrawer` registers a separate native-modal owner with `useModalActive`,
  closes before navigation callbacks, and uses existing motion tokens. The app
  separately registers pending overlay intent. Modal close, menu, button, tab,
  and checkbox targets reserve at least 40px with a coarse pointer, while
  ordinary desktop controls retain their 36/28px density.
- DataTable resolves priority and width before building virtual columns, so
  hidden columns reserve no width. `useTableRowHeight` shares real coarse-row
  geometry with callers; cell bounds and border-box rows match the virtualizer.
  Checkbox has a full-target native input and one selection path, including
  padding clicks. Interaction-owned select-all remains outside sequential Tab.
- Grid/PageLayout/MainContainer preserve shrinkable content; horizontal Tabs
  scroll locally when labels exceed available space. Wizard modal footers stack
  below 576px. PageHeader label and toggle sizing keeps actions distinct from
  the ellipsized title. The existing MenuToggleIcon is exported without changing
  the original glyph source; the app applies its local orientation/color.

### T22 visual consistency

- CodeEditor exposes its visible label or an explicit optional `ariaLabel` as
  the textarea's accessible name, preserving existing external native labels.
- PageHeader adds explicit `titleElement` (`div` by default, opt-in `h1`) so each
  page can retain its single meaningful title without wrapping navigation or
  the mobile menu button in a heading. Typography and responsive sizing remain
  unchanged.
- Tooltip suspends its bubble and pending timer while its actual child control
  has `aria-expanded=true`; its hidden accessible description and ordinary
  pointer/focus/Escape behavior remain.
- Wizard removes its redundant unlocalized Steps title while retaining numbered
  step controls and adds `aria-current=step`; local modal navigation and footer
  spacing use the shared rhythm and preserve existing step/callback semantics.

- Refine the Console sidebar with an opt-in fixed `brandMark`, a separate animated
  collapse control, quieter footer actions, and constrained long labels. Retain the
  existing logo slots for other consumers. Align vertical tab icons and labels to
  the start of each row. Sidebar width animates only for this opt-in layout and
  respects reduced motion.
  Keep the selected tab visible when switching between vertical and horizontal
  layouts, and apply caller tab-panel spacing after the shared defaults.
  Give every virtualized table its measured width so its grid container matches
  the visible rows, including tables without the optional keyboard interaction.
  Keep submenu entries in one full-width column even when tooltips wrap short
  labels; recent buckets never share a row.

### Acceptance form and structure fixes

- Share shrinkable field layout across InputBox, Select, Autocomplete, CommentBox,
  ReadBox and FileSelector. Labels retain a stable desktop column, wrap long text,
  and stack above full-width controls below 768px. Error descriptions wrap locally;
  FormLayout uses shrinkable content and smaller phone padding. ValuePair wraps
  long read-only values without widening the page.
- Use the existing HelpIcon in a small IconButton with its standard pointer/focus
  tooltip; field help is keyboard reachable and never submits the form. Switch
  descriptions are associated with their input, labels wrap, and the original
  rail stays centered within a 40px coarse-pointer target.
- ReadBox uses the shared semantic colors, dimensions and type scale. FileSelector
  associates its native input with the visible label and names its existing file
  action from that field; long selected filenames shrink inside the field.
- SectionTitle accepts optional headingLevel 2/3/4 (default 3), with tag-independent
  title typography so callers can repair heading order without visual enlargement.
  FormLayout's optional title renders at level 2: all current titled callers are
  page forms. Untitled dialog layouts are unchanged, and standalone SectionTitle
  retains level 3 for nested sections.
- InputBox adds opt-in reserveErrorSpace for forms that validate on blur. It
  reserves one caption line without limiting longer messages, so the next label
  stays in place during pointer activation. Only required OpenID/LDAP fields opt
  in; ordinary fields retain their existing spacing.
- Tooltip follows its anchor while painted, including layout shifts that neither
  resize the anchor nor scroll the page. Position updates bail out when unchanged;
  the tracking frame is cancelled on unmount. Hoverable bubbles and their bridge,
  entry/exit timing and Escape behavior remain intact.
- FieldHelp is marked as a supporting control. ModalBox skips it only when choosing
  an implicit initial focus target, so form dialogs start on their first field;
  help remains in the normal Tab order and explicit autofocus still takes priority.
- Field layout derives an effective control height locally, including a 40px
  coarse-pointer minimum after DensityProvider/Elevated density scopes. Inputs,
  selects, autocomplete, read-only/file rows, textarea minimum height, password
  actions and reserved error space use the same height. FormLayout wraps the
  form/help columns by available content width; a ResizeObserver-backed layout
  marker stacks labels below 480px, including narrow tablet content. Export fieldLayout
  and FieldHelp for composed application fields such as the CORS list editor.
- ScreenTitle uses the shared title typography for its default h1 and optional
  h2, and omits empty headings. SectionTitle uses an 8px flex gap for both SVG and
  image icons, without indenting the title relative to fields.
  SectionTitle omits empty text or fragment headings while retaining its action
  toolbar and alignment; nested nonempty headings keep the default level 3.
- DateTimeInput uses the shared field layout, effective height and chrome, with
  a persistent native input and an accessible calendar button. Labels activate
  the actual field, disabled controls remain inert, and narrow content stacks
  labels using the existing width observer. ControlLabels supplies localized
  picker names; the existing Luxon parser, display format and date/time choice
  callbacks are retained.
- DateTimeSelector uses the existing popup-anchor focus protocol inside ModalBox
  and stays in a native dialog when present. Its labelled picker receives focus,
  contains Tab navigation and returns focus on Escape or completed selection.
  Viewport bounds and coarse-pointer 40px calendar/time targets preserve phone
  usability and seven-day rows stay aligned with weekday labels. Time choice
  buttons retain their identity across value updates, including minute-first and
  seconds-enabled selection. ControlLabels localizes the picker, calendar locale,
  time columns and previous/next navigation; numeric edit parsing is unchanged.
  Calendar day cells show localized numbers without date-unit suffixes while
  retaining full localized dates as accessible names. The selected date follows
  its locale's natural date order instead of a fixed day-month-year pattern.
- Tooltip portals stay in the nearest existing main/navigation/complementary or
  named region, prioritizing native and semantic dialogs. Placement converts
  viewport coordinates when a transformed dialog creates a containing block;
  original hover, accessible description, Escape and top-layer behavior remain.
- CreateGroupIcon and ServiceAccountCredentialsIcon retain all original geometry
  and replace their fixed green creation-action fills with currentColor.
  FilterIcon retains its geometry while using currentColor for its fixed dark
  strokes and the existing card-surface token for white masking circles, keeping
  the same original slider icon visible in both themes.
- Select accepts an optional aria-label for composed fields whose visible source
  label lives outside the control. The trigger uses aria-labelledby to combine
  that explicit name (or the field label) with its rendered value, including
  fixed labels and placeholders. The listbox retains the field name and its
  existing fixed-label/placeholder/value fallbacks. Mounted regressions cover
  changing English/Chinese names, renderable labels, disabled controls and
  keyboard selection, dismissal and focus restoration.
- DataTable measures its stable container with a local native ResizeObserver
  instead of the virtualizer's legacy scroll-trigger AutoSizer. Functional state
  updates preserve the latest dimensions when a transient zero-sized layout and
  restoration arrive in the same React batch. Offset-size rounding and padding
  subtraction retain the prior geometry; observers mount with the actual table
  after loading/empty states and disconnect when that table unmounts.

### Native toggle label association

Checkbox and Switch keep their native input and existing painted/coarse target sizes, but the target wrapper is a span so an explicit text label is the sole label association. Checkbox generates a stable ID when a visible label is supplied without one; caller-provided IDs, disabled behavior, help, and checkbox row-click isolation remain intact. Actual mounted regressions cover text-label and keyboard activation, exact-once change events, generated labels, and 40px coarse targets.

### Sidebar brand interaction

The opt-in `brandMark` header is one native, named collapse/expand button instead
of a separate arrow control. Its stable 28px mark moves from the expanded inset
to the rail center while the 20px wordmark fades; the same button retains focus
through Enter, Space and pointer activation. Collapsed menu icons also center
from the configured rail width, including both 64px and 72px rails, without
changing their expanded alignment. Reduced motion disables geometric
travel, the full header exceeds the 40px coarse target, and the mobile drawer
continues to close through its existing callback. Legacy logo-only headers keep
their prior behavior. The stable-brand sidebar retains neutral paper surfaces,
active/hover feedback and a separated, quieter footer.

### Lucide action and navigation icons

174 production icon definitions retain their existing MDS/application import paths
and use a pinned subset of 111 Lucide 1.61.0 SVGs. Brand and provider artwork, the
filled health dot, and unused compatibility/gallery icons remain unchanged.
`src/components/Icons/lucide/manifest.json` records the exact upstream commit, SVG
hashes and export mapping. The full Lucide ISC and Feather MIT notices ship in
`../../licenses/lucide-LICENSE.txt` and the generated Console credits.

A local React adapter preserves SVG props, refs, class/style hooks, caller
children and optional accessible names. Icons are decorative by default; named
icons use image semantics. Outlines inherit caller stroke and foreground color;
a fill-free geometry group isolates them from legacy root fill rules. Width-only
sizing retains the square viewBox ratio. No icon font or runtime dependency is
added. Semantic colors move to the existing icon hosts, and obsolete menu
rotation is removed at the mobile header.

### Deferred row focus and finite progress

DataTable cancels a queued keyboard focus request when a later Tab, pointer
press or focus transfer takes ownership, and removes those listeners on completion
or unmount. Escape still restores the active row when uninterrupted; `/`, Tab
and pointer actions cannot be overridden by its stale animation-frame callback.
Mounted real-object-table regressions exercise these orderings without delaying
input, alongside virtualization, arrows, selection and dialog behavior.

ProgressBar normalizes non-finite values and invalid maxima to zero for determinate
progress and clamps finite ratios to 0–100 before painting or exposing ARIA.
Division precedes multiplication to avoid overflow for large finite inputs.
Indeterminate progress continues to omit `aria-valuenow` and a percentage label.
Regressions cover invalid inputs, bounds, cancellation, and the real Speedtest
component's initial, running and completed states.

### Tab visibility after resize

Tabs keeps the currently focused tab visible when a resize notification arrives
after keyboard navigation. If the tab list has no focused tab, it reveals the
selected tab as before. Manual activation and selection remain unchanged;
regressions deliver a real resize after End and verify that focus remains visible
without changing selection.

### Byte measurements and unavailable values

`calculateBytes` now consumes complete decimal/exponent strings and bounds its
unit index for fractional rates and very large measurements. Invalid, negative
and non-finite values return an explicit null total and empty unit. Console uses
this same exported helper with its optional Kubernetes unit table. Speed and
capacity consumers render unavailable measurements as N/A; Speedtest and
SizeChart retain decimal rates instead of truncating them to whole units.

The parser is exported as `parseByteMeasurement`, so Console's text formatter
(`niceBytes`) treats blank, null, hexadecimal and negative input as N/A exactly
as `calculateBytes` does. `scaleBytes` carries a value that rounds up to the
next unit, so 1048575 bytes renders as 1 MiB rather than 1024 KiB.

### Multilingual controls and RTL

The shared control-label provider supplies the Actions heading. Dropdown items
accept `lang` and `dir` for language autonyms, and popup start/end alignment
follows the anchor's direction. Spacing, borders and edge positioning use logical
CSS properties. Mobile drawers open from inline start; switch thumbs and marked
navigation arrows follow RTL direction. Editors keep source text LTR, and read
values use isolated direction. Physical viewport geometry used by portals and
hover highlights is retained. Console's nine-language and pseudo-locale browser
tests cover keyboard selection, small screens, live language changes and payload
isolation alongside the existing English/Chinese regression suite.

The shared DropdownSelector popup is statically imported so the language menu
works without a network after initial load. Popup visibility, modal presence,
keyboard interaction and exit transitions still use the existing shared hooks.
