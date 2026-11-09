// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"

	"github.com/minio/cli"
	"github.com/minio/console/api"
	"github.com/minio/console/pkg/certs"
	"github.com/minio/console/pkg/usage"
)

var usageWorkerCmd = cli.Command{
	Name:  "usage-worker",
	Usage: "Observe storage changes and refresh durable bucket-usage metadata",
	Flags: []cli.Flag{
		cli.StringFlag{
			Name:  "certs-dir",
			Value: certs.GlobalCertsCADir.Get(),
			Usage: "path to certs directory; certificates in its CAs directory are trusted for the storage endpoint",
		},
	},
	Action: func(cliCtx *cli.Context) error {
		config, err := usage.LoadConfig(true)
		if err != nil {
			return err
		}
		if err = loadUsageWorkerTLS(cliCtx, &config); err != nil {
			return err
		}
		ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
		defer cancel()
		return usage.RunWorker(ctx, config)
	},
}

// loadUsageWorkerTLS gives the worker the server's outbound trust: system
// roots, certs/CAs and Console's public certificate, with the endpoint-scoped
// CONSOLE_MINIO_SERVER_TLS_SKIP_VERIFY policy applied to the SILO endpoint.
// The worker serves no TLS, so it neither creates the certs directory nor
// loads a private key; a read-only or key-protected certs directory works.
func loadUsageWorkerTLS(ctx *cli.Context, config *usage.Config) error {
	dir, _, err := certs.ResolveConfigDirFromCtx(ctx, "certs-dir", certs.DefaultCertsDir.Get)
	if err != nil {
		return err
	}
	certs.GlobalCertsDir = dir
	certs.GlobalCertsCADir = &certs.ConfigDir{Path: filepath.Join(dir.Get(), certs.CertsCADir)}
	if api.GlobalRootCAs, err = certs.GetTrustedRootCAs(); err != nil {
		return fmt.Errorf("unable to load trusted certificates at %s: failed with %w", dir.Get(), err)
	}
	api.ApplyGlobalRootCAs()
	config.Transport = api.MinIOEndpointTransport()
	return nil
}
