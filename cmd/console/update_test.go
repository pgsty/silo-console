// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

package main

import "testing"

func TestUpdateDisabled(t *testing.T) {
	if automaticUpdatesEnabled {
		t.Fatal("automatic updates must remain disabled until the release gate is complete")
	}
	if err := updateInplace(nil); err != nil {
		t.Fatalf("disabled update command returned an error: %v", err)
	}
}
