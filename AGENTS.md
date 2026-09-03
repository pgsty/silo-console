# SILO Console Guide

SILO Console is maintained and release-tested for `pgsty/silo`. Compatibility
with unmodified upstream MinIO is best effort, not a product or release
guarantee. Inherited upstream-MinIO build jobs may provide advisory information,
but must not constrain the maintained dependency graph or block a SILO release
unless the user explicitly asks for that gate.

Use `github.com/pgsty/silo-pkg/v3` directly for shared SILO functionality. Do
not pin, downgrade, or reimplement around it merely to compile against upstream
`github.com/minio/pkg/v3`. An unavoidable transitive `minio/pkg` package is not
the product implementation and should remain indirect and documented.

Use the verified upstream `github.com/minio/minio-go/v7` commit as the explicit
exception. The maintained Console graph may select `pgsty/mc`; test integration
against `pgsty/silo`. Preserve low-cost wire, configuration, CLI, migration, and
import compatibility where practical, and describe it as best effort.

Do not treat a local build, tag, draft release, image, documentation preview, or
another repository's CI result as proof that this repository has been released.
