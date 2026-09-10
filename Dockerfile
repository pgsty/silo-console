# Build images are reviewed immutable inputs; Dependabot proposes digest updates.
FROM node:24-bookworm@sha256:6dac556d980b7f0e5498d08f08cee0ca67798b4ad6c23964a9214920e67758d0 AS uilayer
WORKDIR /app
RUN corepack enable
COPY web-app/package.json web-app/yarn.lock web-app/.yarnrc.yml ./
COPY web-app/.yarn ./.yarn
RUN yarn install --immutable
COPY web-app ./
RUN yarn build && ./optimize-embed.sh

# CI exports this stage to compare the source-built UI with release assets.
FROM scratch AS web-assets
COPY --from=uilayer /app/build /build

FROM golang:1.27.1-alpine@sha256:cf6fca6641884b8433441b2b0652976f975e1d0fdd26d177eaaf8596087f3125 AS golayer
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

FROM scratch
ARG build_version=dev
ARG build_commit=unknown
ARG build_time
LABEL org.opencontainers.image.source="https://github.com/pgsty/silo-console" \
      org.opencontainers.image.licenses="AGPL-3.0-or-later" \
      org.opencontainers.image.version="${build_version}" \
      org.opencontainers.image.revision="${build_commit}" \
      org.opencontainers.image.created="${build_time}"
COPY --from=golayer /console/console /console
COPY LICENSE NOTICE CREDITS /usr/share/licenses/silo-console/
EXPOSE 9090
USER 1000:1000
ENTRYPOINT ["/console"]
CMD ["server"]
