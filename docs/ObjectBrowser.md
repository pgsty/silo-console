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

## Public buckets

Anonymous browsing of public buckets uses the same identity rules for previews
and downloads.
