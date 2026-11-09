# Build images are reviewed immutable inputs; Dependabot proposes digest updates.
FROM node:24.22.1-bookworm@sha256:6449e19d8184d84062525b6a7524def03146c2cb04a7f08b076680d0e8e4240a AS uilayer
WORKDIR /app
RUN corepack enable
COPY web-app/package.json web-app/yarn.lock web-app/.yarnrc.yml ./
COPY web-app/.yarn ./.yarn
COPY web-app/packages ./packages
RUN yarn install --immutable
COPY web-app ./
RUN yarn build && ./optimize-embed.sh

# CI exports this stage to compare the source-built UI with release assets.
FROM scratch AS web-assets
COPY --from=uilayer /app/build /build

FROM golang:1.27.3-alpine@sha256:d530cf60723abf1ffae0cd16bb546b379ec0550d2f3815e5b16ed69dbc00fba4 AS golayer
WORKDIR /console
COPY go.mod go.sum ./
RUN go mod download
COPY . ./
COPY --from=uilayer /app/build ./web-app/build
ARG build_version=dev
ARG build_release_version
ARG build_commit=unknown
ARG build_short_commit
ARG build_time
ARG SOURCE_DATE_EPOCH=0
ENV CGO_ENABLED=0 GOWORK=off
RUN release_version="${build_release_version:-${build_version#v}}"; \
    release_time="${build_time:-$(date -u -d "@${SOURCE_DATE_EPOCH}" +%Y-%m-%dT%H:%M:%SZ)}"; \
    short_commit="${build_short_commit:-$(printf '%s' "$build_commit" | cut -c1-7)}"; \
    go build -trimpath -buildvcs=false --tags=kqueue,operator \
      -ldflags "-s -w -X github.com/minio/console/pkg.ReleaseTag=${build_version} -X github.com/minio/console/pkg.CommitID=${build_commit} -X github.com/minio/console/pkg.Version=${release_version} -X github.com/minio/console/pkg.ShortCommitID=${short_commit} -X github.com/minio/console/pkg.ReleaseTime=${release_time}" \
      -o console ./cmd/console

# scratch has no CA bundle and no /tmp. Go reads the system roots from
# /etc/ssl/certs/ca-certificates.crt for HTTPS to SILO and OIDC providers, and
# spills large multipart uploads to /tmp. The bundle is architecture-neutral,
# so it is built once on the builder platform, with the same blocklist as the
# pgsty/silo and pgsty/mc images.
FROM --platform=$BUILDPLATFORM registry.access.redhat.com/ubi9/ubi:latest@sha256:16e9e43d99e181463513cc84a514859b1abb9460f1c4d9e208da4b4e51cd5cc3 AS certs
# Native root blocklist mitigation: https://access.redhat.com/security/vulnerabilities/RHSB-2026-012
RUN dnf -y install ca-certificates && \
    if [ -d /etc/pki/ca-trust/source/blocklist ]; then \
      blocklist=/etc/pki/ca-trust/source/blocklist; \
    else \
      blocklist=/etc/pki/ca-trust/source/blacklist; \
    fi && \
    trust extract --overwrite --format=pem-bundle \
      --filter='pkcs11:object=Comodo%20AAA%20Services%20root;type=cert' \
      "$blocklist/Comodo_AAA_Services_root.pem" && \
    trust extract --overwrite --format=pem-bundle \
      --filter='pkcs11:object=emSign%20ECC%20Root%20CA%20-%20G3;type=cert' \
      "$blocklist/emSign_ECC_Root_CA_-_G3.pem" && \
    update-ca-trust && \
    mkdir -p /rootfs/etc/ssl/certs /rootfs/tmp && \
    chmod 1777 /rootfs/tmp && \
    cp /etc/pki/ca-trust/extracted/pem/tls-ca-bundle.pem /rootfs/etc/ssl/certs/ca-certificates.crt

FROM scratch
ARG build_version=dev
ARG build_commit=unknown
ARG build_time
LABEL org.opencontainers.image.source="https://github.com/pgsty/silo-console" \
      org.opencontainers.image.licenses="AGPL-3.0-or-later" \
      org.opencontainers.image.version="${build_version}" \
      org.opencontainers.image.revision="${build_commit}" \
      org.opencontainers.image.created="${build_time}"
# Copy the parent so tmp/ arrives as a directory entry and keeps mode 1777.
COPY --from=certs /rootfs/ /
COPY --from=golayer /console/console /console
COPY LICENSE NOTICE CREDITS /usr/share/licenses/silo-console/
EXPOSE 9090
USER 1000:1000
ENTRYPOINT ["/console"]
CMD ["server"]
