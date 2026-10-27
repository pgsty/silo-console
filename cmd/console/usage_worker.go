// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"

	"github.com/minio/cli"
	"github.com/minio/console/pkg/usage"
)

var usageWorkerCmd = cli.Command{
	Name:  "usage-worker",
	Usage: "Observe storage changes and refresh durable bucket-usage metadata",
	Action: func(_ *cli.Context) error {
		config, err := usage.LoadConfig(true)
		if err != nil {
			return err
		}
		ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
		defer cancel()
		return usage.RunWorker(ctx, config)
	},
}
