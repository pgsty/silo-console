# Object Browser

This page records how the object browser keeps its details, dialogs and actions
bound to the object you are looking at. No configuration or operator migration
is required; the behaviour applies to every deployment.

## One object at a time

Every request the browser issues for an object carries the object's identity:
the bucket, the object key, and either "the current version" or one explicit
version id. When you move to another object, another version, or another
bucket, the requests that were still in flight for the previous object are
abandoned and their responses are discarded, so a slow answer for object A can
no longer replace the details of object B after you have already moved on.

The same identity is used by every action. Download, share, preview, tags,
retention, legal hold, inspect, restore and delete are only offered once the
object details have been resolved for the object named in the address bar, and
each of them acts on exactly that object. While a version switch is being
resolved the panel shows its loading state and the actions are unavailable;
no details of the previously displayed version remain on screen.

Bucket status (versioning and object locking) is reloaded whenever you switch
buckets, whichever kind of path you arrive on, and a response for a bucket you
have already left is not applied.

## Dialogs follow the object

The share, preview, retention, tags, legal hold, restore and delete dialogs
capture the identity of the object they were opened for. When the object or the
bucket changes underneath an open dialog, the dialog is closed and reset rather
than left open on a different object. The share dialog resolves the exact
version it will share before it requests a link; if that version cannot be
found or is a delete marker it says so and does not create a link.

## Delete semantics are unchanged

Deleting the current object still deletes the current object, which creates a
delete marker in a versioned bucket. Deleting an explicitly selected version
still deletes that version only. "Delete non-current versions" and "Delete
selected versions" act on the object and versions that were listed when the
dialog opened.

## Paging

A directory listing is loaded one page at a time. The page size is 100 by
default and can be set to 50, 100, 250, 500 or 1000; there is no "all" mode.
Each page is exactly one `ListObjectsV2` request with `MaxKeys` equal to the
page size, and the next page continues from the continuation token that
request returned. Console never derives a cursor from the last displayed row,
never counts the directory, and offers first/previous/next only: a total or an
arbitrary jump would require scanning the directory. A server that answers
with fewer keys than asked for produces a short page; it is shown as it came,
and the next page resumes from its token.

The rows on screen, the page size, the cursor history and the page number
change together, and only when a page has arrived in full. A failed page
leaves the previous page in place for a retry, while moving to another bucket,
directory or history mode clears the previous rows at once.

The bar under the table says what the rows represent. "N items in total"
appears only when the first page held the whole directory; then sorting, the
name filter and "select all" cover the directory. Every other page, the last
one included, is labelled "Page K · N on this page", and sorting, filtering
and "select all" cover that page only. Neither sorting nor filtering issues a
request. Paging keeps the filter text and clears the selection; a new page size
returns to the first page; a new directory clears the filter. A page whose
rows are synthesized from the session's permissions after an access-denied
answer is never a complete directory.

Rewind and "show deleted objects" listings have no cursor. They return at most
1000 versions within a fixed time budget and are labelled as stopped at the
row or time limit when either applies. These limits bound what reaches the
browser, not the versions the server scans to produce them.

## Public buckets

Anonymous browsing of public buckets uses the same identity rules for previews
and downloads. The anonymous Object Manager WebSocket draws on a separate,
small connection budget (`CONSOLE_WS_MAX_ANONYMOUS_CONNECTIONS`, per client
`CONSOLE_WS_MAX_ANONYMOUS_CONNECTIONS_PER_CLIENT`); when it is exhausted the
handshake is refused and the browser falls back to retrying, while signed-in
sessions are unaffected. See docs/Environment.md, "WebSocket connection
limits".
