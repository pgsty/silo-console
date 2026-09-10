# Release and verification contract

This contract applies to releases built from this source revision onward. Older
releases do not retroactively acquire signatures or provenance.

## Deterministic inputs

Release binaries, archives and DEB/RPM/APK packages use the tagged commit's UTC
committer timestamp. Build execution time is not embedded in them. The same
commit timestamp supplies `SOURCE_DATE_EPOCH` to OCI builds. Archive ownership,
binary modification times and package file times are normalized.

Use Go **1.27.1**, Node **24.21.0**, Yarn **4.13.0**, GoReleaser **2.17.1**,
Docker Buildx **0.36.1** and the reviewed image digests in `Dockerfile`. Build
from a clean checkout with `GOWORK=off`, `CGO_ENABLED=0`, `TZ=UTC` and `LC_ALL=C`.
Use the committed `go.sum`, Yarn lockfile and Yarn patches without local module
replacements. The source image consumes the same version, full/short commit and
UTC release time as GoReleaser. Its Go build intentionally omits VCS metadata
because `.git` is outside the container context; equivalence checks compare the
reported release version and rebuilt frontend assets, not the executable hash.

Run `hack/check-reproducible.sh` from a committed tree. It creates independent
checkouts and Go build caches, rebuilds binaries, bundles, packages and source
archives, then compares their sorted SHA-256 manifests. `hack/check-container-equivalence.sh`
runs after a GoReleaser snapshot on Linux amd64 and checks source-image metadata
and every frontend asset against the release inputs. Both checks run in CI.

nFPM 2.47.0 embeds the source mtime of APK lifecycle scripts and iterates multiple
scripts in unspecified map order. The build normalizes those source mtimes, and
the stock Alpine package carries only its account-creation hook. Debian/RPM
retain their systemd reload/removal hooks through format-specific overrides.

SBOM creation timestamps and SPDX namespaces are normalized for binary, package
and source SBOMs. Signatures, transparency-log entries, provenance statements
and registry-generated metadata are evidence produced at signing time; they are
not byte-reproducible release payloads. The reproducibility job excludes signing,
SBOM generation and Docker publication; registry image digest reproducibility
across BuildKit versions is not asserted by that job.

## CI dependency review

All Actions use full commit SHAs with version comments. Browser tools (including
TestCafe and the MinIO test client) come from `web-app/yarn.lock`, installed with
`yarn install --immutable`. CI never adds dependencies at runtime. Semgrep and its
transitive Python dependencies are hash-locked in `.github/requirements/semgrep.txt`
for Python 3.12 on Linux x86_64. Regenerate that file from `semgrep.in` with the
command recorded in its header and review the complete change. Go tools use
explicit module versions verified through the Go module checksum database.
TestCafe uses Firefox **155.0.1** from Mozilla's release archive, verified against
the SHA-512 digest in `.github/requirements/firefox.env`; the runner's system
Firefox is not selected. Review that version and digest together when updating.

Dependabot proposes reviewed updates for Actions, Go, Yarn, Python and Docker.
There is no automatic merge policy. Cache keys use the lockfile/tool version or
an exact workflow run for artifacts shared by jobs; an artifact cache from a
different run is not accepted. Production JavaScript advisories are gated
separately from the high-severity gate covering all development/test dependencies.
The Go vulnerability gate remains independent.

## Signatures, SBOMs and provenance

The tag workflow uses Sigstore keyless signing with Cosign **3.1.3** and GitHub's
OIDC identity. It signs checksum manifests and OCI images, publishes SPDX SBOMs
from Syft **1.51.1** for binaries, packages, source and images, and creates GitHub
build provenance for the checksum manifest and OCI image digest. The source SBOM
contains the locked Go/JavaScript graph, including development dependencies;
artifact SBOMs describe what the corresponding binary/package/image scanner can
identify. Consult both when auditing bundled JavaScript.

The checksum manifest binds each binary, package and source SBOM to its digest.
CI verifies manifest/image signatures, image SBOM attestations and build
provenance before declaring a draft ready to publish. Git tag signatures are
optional: the mandatory identity is the release workflow at the exact tag and
validated commit. No managed signing key is stored, so there is no managed-key
rotation procedure. Restrict write access to the repository, tag workflow and
Actions OIDC permissions; investigate/revoke affected release digests if that
identity is compromised.

Download the binary/package, its checksum manifest and `.sigstore.json` bundle
from the same GitHub release. Example (replace `vX.Y.Z` and filenames):

```sh
identity='https://github.com/pgsty/silo-console/.github/workflows/release.yaml@refs/tags/vX.Y.Z'
issuer='https://token.actions.githubusercontent.com'
cosign verify-blob --bundle silo-console_X.Y.Z_checksums.txt.sigstore.json \
  --certificate-identity "$identity" --certificate-oidc-issuer "$issuer" \
  silo-console_X.Y.Z_checksums.txt
gh attestation verify silo-console_X.Y.Z_checksums.txt --repo pgsty/silo-console
sha256sum --ignore-missing --check silo-console_X.Y.Z_checksums.txt
cosign verify --certificate-identity "$identity" --certificate-oidc-issuer "$issuer" \
  ghcr.io/pgsty/silo-console@sha256:IMAGE_DIGEST
gh attestation verify oci://ghcr.io/pgsty/silo-console@sha256:IMAGE_DIGEST \
  --repo pgsty/silo-console
```

For offline checksum verification, prepare Cosign's trusted Sigstore root/cache
on a connected machine (`cosign initialize`) and transfer it with the verification
material. Use `cosign verify-blob --offline` with the same bundle, issuer and
identity constraints, then check the artifact hashes locally. Do not substitute
an untrusted root supplied beside an untrusted artifact. GitHub's online
attestation lookup is a separate check; retain its downloaded bundle if offline
provenance verification is needed.

## Publication and GHCR

GHCR is intended to distribute public release images. Creating a release tag
builds the candidate version image and draft GitHub release. **It never advances
`latest`.** The tag workflow refuses to overwrite a published release. A draft
retry may replace candidate artifacts after reproducing and verifying them.

After a maintainer publishes the verified draft, `promote-image.yaml` verifies
that it is the current stable GitHub release, checks the signatures, SBOM
attestation and provenance for its exact image digest, and tests anonymous access
with an empty Docker credential directory. Only then does it promote that digest
to `latest`. Drafts, prereleases, older release events and failed verification do
not advance `latest`. Publication events are serialized and the latest release
is checked again immediately before promotion.

The package owner must make the GHCR package public and grant the release
workflow write access. If anonymous pulls fail, correct package visibility or
access and rerun the failed promotion job. A successful authenticated push does
not prove anonymous availability. Never claim that a draft or a green repository
build is a coordinated SILO product release.

References: [GoReleaser reproducibility](https://goreleaser.com/blog/reproducible-builds/),
[GoReleaser signing](https://goreleaser.com/customization/sign/sign/),
[GitHub artifact attestations](https://docs.github.com/en/actions/security-for-github-actions/using-artifact-attestations).
