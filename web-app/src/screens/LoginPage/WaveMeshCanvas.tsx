// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { SILO_COLORS } from "../../common/SiloBrand";

// Ambient background for the login brand panel: a slowly breathing mesh of
// glowing sine threads (plus drifting motes), computed per-frame on canvas.
// Hand-rolled — no animation dependency.

const LINE_COUNT = 42;
const SAMPLE_STEP = 9;
const SPREAD = 165;
const FRAME_MS = 33; // ~30fps is plenty for this pace

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  copper: boolean;
}

const hexToRgb = (hex: string) => {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255] as const;
};

const STEEL_RGB = hexToRgb(SILO_COLORS.steel);
const SKY_RGB = hexToRgb(SILO_COLORS.sky);
const NIGHT_RGB = hexToRgb(SILO_COLORS.night);
const COPPER_RGB = hexToRgb(SILO_COLORS.copper);

const rgba = (rgb: readonly [number, number, number], alpha: number) =>
  `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;

const buildMotes = (width: number, height: number): Mote[] => {
  const motes: Mote[] = [];
  const count = Math.max(18, Math.min(40, Math.round(width / 42)));
  for (let i = 0; i < count; i++) {
    motes.push({
      x: Math.random() * width,
      y: height * (0.5 + Math.random() * 0.4),
      vx: 3 + Math.random() * 6,
      vy: (Math.random() - 0.5) * 2.4,
      radius: 0.7 + Math.random(),
      phase: Math.random() * Math.PI * 2,
      copper: Math.random() < 0.1,
    });
  }
  return motes;
};

const MeshCanvas = styled.canvas({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "block",
});

const WaveMeshCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let width = 0;
    let height = 0;
    let motes: Mote[] = [];
    let rafId = 0;
    let running = false;
    let lastTick = 0;
    let lastDraw = 0;
    let elapsed = 20; // start with a developed shape, not a flat line
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const setupSize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      motes = buildMotes(width, height);
    };

    const drawFrame = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      const k1 = (Math.PI * 2 * 1.6) / width;
      const k2 = (Math.PI * 2 * 3.1) / width;
      const k3 = (Math.PI * 2 * 6.5) / width;
      const copperLine = Math.floor(LINE_COUNT * 0.68);

      // Threads accumulate additively — that is what makes them glow.
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < LINE_COUNT; i++) {
        const u = i / (LINE_COUNT - 1) - 0.5;
        const centered = 1 - Math.abs(u) * 2;
        const isCopper = i === copperLine;

        let alpha: number;
        let color: string;
        if (isCopper) {
          alpha = 0.32;
          color = `${COPPER_RGB[0]}, ${COPPER_RGB[1]}, ${COPPER_RGB[2]}`;
        } else {
          alpha = 0.09 + 0.15 * centered;
          const mix = u + 0.5;
          const r = Math.round(
            STEEL_RGB[0] + (SKY_RGB[0] - STEEL_RGB[0]) * mix,
          );
          const g = Math.round(
            STEEL_RGB[1] + (SKY_RGB[1] - STEEL_RGB[1]) * mix,
          );
          const b = Math.round(
            STEEL_RGB[2] + (SKY_RGB[2] - STEEL_RGB[2]) * mix,
          );
          color = `${r}, ${g}, ${b}`;
        }

        ctx.beginPath();
        for (let x = -SAMPLE_STEP; x <= width + SAMPLE_STEP; x += SAMPLE_STEP) {
          const nx = x / width;
          const yCenter =
            height * 0.72 - height * 0.06 * Math.sin(nx * Math.PI * 0.9 + 0.2);
          const ampEnv =
            Math.pow(Math.max(0, Math.sin(Math.PI * (0.05 + 0.9 * nx))), 0.9) *
            (0.35 + 0.65 * Math.pow(nx, 0.7));
          const pinch =
            0.3 + 0.7 * (0.5 + 0.5 * Math.sin(nx * Math.PI * 3.2 - t * 0.18));
          const w1 = 40 * ampEnv * Math.sin(x * k1 + t * 0.32 + i * 0.52);
          const w2 = 18 * ampEnv * Math.sin(x * k2 - t * 0.21 + i * 0.33);
          const w3 = 5 * Math.sin(x * k3 + t * 0.55 + i * 1.31);
          const y = yCenter + u * SPREAD * ampEnv * pinch + w1 + w2 + w3;
          if (x <= -SAMPLE_STEP + 0.01) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        // Two passes over the same path: a wide soft halo, then a bright core.
        ctx.strokeStyle = `rgba(${color}, ${alpha * 0.4})`;
        ctx.lineWidth = isCopper ? 3 : 2.4;
        ctx.stroke();
        ctx.strokeStyle = `rgba(${color}, ${alpha})`;
        ctx.lineWidth = isCopper ? 1.3 : 1;
        ctx.stroke();
      }

      // Drifting motes above and inside the mesh.
      for (const mote of motes) {
        const twinkle = 0.5 + 0.5 * Math.sin(t * 0.7 + mote.phase);
        const color = mote.copper ? COPPER_RGB : SKY_RGB;
        ctx.fillStyle = rgba(color, 0.08 + 0.25 * twinkle);
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dissolve the mesh at the panel edges instead of clipping it.
      ctx.globalCompositeOperation = "source-over";
      const maskWidth = Math.min(160, width * 0.14);
      const zoneTop = height * 0.42;
      const leftMask = ctx.createLinearGradient(0, 0, maskWidth, 0);
      leftMask.addColorStop(0, rgba(NIGHT_RGB, 1));
      leftMask.addColorStop(1, rgba(NIGHT_RGB, 0));
      ctx.fillStyle = leftMask;
      ctx.fillRect(0, zoneTop, maskWidth, height - zoneTop);
      const rightMask = ctx.createLinearGradient(
        width - maskWidth,
        0,
        width,
        0,
      );
      rightMask.addColorStop(0, rgba(NIGHT_RGB, 0));
      rightMask.addColorStop(1, rgba(NIGHT_RGB, 1));
      ctx.fillStyle = rightMask;
      ctx.fillRect(width - maskWidth, zoneTop, maskWidth, height - zoneTop);
    };

    const step = (now: number) => {
      if (!running) {
        return;
      }
      rafId = window.requestAnimationFrame(step);
      if (now - lastDraw < FRAME_MS) {
        return;
      }
      const dt = Math.min((now - lastTick) / 1000, 0.1);
      lastTick = now;
      lastDraw = now;
      elapsed += dt;
      for (const mote of motes) {
        mote.x += mote.vx * dt;
        mote.y += mote.vy * dt;
        if (mote.x > width + 8) {
          mote.x = -8;
          mote.y = height * (0.5 + Math.random() * 0.4);
        }
        if (mote.y < height * 0.46 || mote.y > height * 0.94) {
          mote.vy = -mote.vy;
        }
      }
      drawFrame(elapsed);
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(rafId);
    };

    const start = () => {
      if (running) {
        return;
      }
      running = true;
      lastTick = performance.now();
      lastDraw = 0;
      rafId = window.requestAnimationFrame(step);
    };

    const applyMode = () => {
      stop();
      if (reducedMotion.matches) {
        drawFrame(elapsed);
      } else {
        start();
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        applyMode();
      }
    };

    setupSize();
    applyMode();

    const resizeObserver = new ResizeObserver(() => {
      setupSize();
      if (reducedMotion.matches || document.hidden) {
        drawFrame(elapsed);
      }
    });
    resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", handleVisibility);
    reducedMotion.addEventListener("change", applyMode);

    return () => {
      stop();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      reducedMotion.removeEventListener("change", applyMode);
    };
  }, []);

  return <MeshCanvas ref={canvasRef} aria-hidden="true" />;
};

export default WaveMeshCanvas;
