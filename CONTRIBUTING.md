# Contributing to SILO Console

Submit issues and pull requests to [pgsty/silo-console](https://github.com/pgsty/silo-console).
SILO Console is maintained and tested with the [SILO server](https://github.com/pgsty/silo).
Compatibility with unmodified upstream MinIO is best effort.

See [DEVELOPMENT.md](DEVELOPMENT.md) for the development environment and frontend
workflow. The REST API uses [go-swagger](https://github.com/go-swagger/go-swagger).
The API handlers are created from `swagger.yml`.

## Licensing of Contributions

Code contributions are accepted under [GNU AGPL v3.0 or later](LICENSE)
(`AGPL-3.0-or-later`), the same license as SILO Console.

- **No CLA.** Contributors retain copyright in their original work. No
  Contributor License Agreement, copyright assignment, or separate Apache-2.0
  license grant to SILO or upstream MinIO maintainers is required. Contributions
  are accepted inbound=outbound; maintainers receive no rights beyond the
  applicable project license.
- **DCO sign-off.** Sign each commit with `git commit -s` to certify the
  [Developer Certificate of Origin 1.1](https://developercertificate.org/).
  Preserve sign-off trailers when squashing commits.
- **Provenance and notices.** Preserve original authorship, copyright, and
  license notices when importing or modifying existing code. New original files
  name their actual copyright holders and use AGPL-3.0-or-later. Separately
  licensed third-party material keeps its existing license and attribution.

## API Changes

To add new api, the YAML file needs to be updated with all the desired apis using
the [Swagger Basic Structure](https://swagger.io/docs/specification/2-0/basic-structure/), this includes paths,
parameters, definitions, tags, etc.

## Generate server from YAML

Once the YAML file is ready we can autogenerate the code needed for the new api by just running:

Validate it:

```
go tool swagger validate ./swagger.yml
```

Update server code:

```
make swagger-gen
```

This will update all the necessary code.

`./api/configure_console.go` is a file that contains the handlers to be used by the application, here is the only place
where we need to update our code to support the new apis. This file is not affected when running the swagger generator
and it is safe to edit.

## Unit Tests

`./api/handlers_test.go` needs to be updated with the proper tests for the new api.

To run tests:

```
go test ./api
```

## Commit changes

After verification, commit your changes with a concise message and a DCO sign-off:

```
git commit -s -am 'Add some feature'
```

### Push to the branch

Push your locally committed changes to the remote origin (your fork)

```
$ git push origin my-new-feature
```

### Create a Pull Request

Open a pull request against the `main` branch of `pgsty/silo-console`. Include
the motivation, test evidence, and compatibility or UI impact. Public product
documentation belongs in [pgsty/silo.pgsty.com](https://github.com/pgsty/silo.pgsty.com).

## FAQs

### How does ``console`` manages dependencies?

SILO Console uses `go mod` to manage its dependencies.

- Run `go get foo/bar` in the source folder to add the dependency to `go.mod` file.

To remove a dependency

- Edit your code and remove the import reference.
- Run `go mod tidy` in the source folder to remove dependency from `go.mod` file.

### What are the coding guidelines for console?

``console`` is fully conformant with Golang style.
Refer: [Effective Go](https://go.dev/doc/effective_go) and [CodeReviewComments](https://go.dev/wiki/CodeReviewComments) article from Golang project.
