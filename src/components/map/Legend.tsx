"use client";

import { useMemo } from "react";
import {
  HUMIDITY_DOMAIN,
  TEMP_DOMAIN,
  humidityScale,
  tempScale,
} from "@/lib/colorScale";
import type { LayerKind } from "@/types/amedas";

const TITLES: Record<LayerKind, string> = {
  currentTemp: "現在の気温 (°C)",
  humidity: "現在の湿度 (%)",
  todayRange: "本日の最高気温 (°C)",
};

interface LegendProps {
  layer: LayerKind;
}

export function Legend({ layer }: LegendProps) {
  const isHumidity = layer === "humidity";
  const [min, max] = isHumidity ? HUMIDITY_DOMAIN : TEMP_DOMAIN;
  const scale = isHumidity ? humidityScale : tempScale;

  const gradient = useMemo(() => {
    const stops = Array.from({ length: 9 }, (_, i) => {
      const t = i / 8;
      const value = min + t * (max - min);
      return `${scale(value)} ${(t * 100).toFixed(0)}%`;
    });
    return `linear-gradient(to right, ${stops.join(", ")})`;
  }, [scale, min, max]);

  const mid = Math.round((min + max) / 2);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 24,
        left: 12,
        width: 200,
        background: "var(--panel-surface)",
        borderRadius: 8,
        padding: "8px 12px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        fontSize: 12,
      }}
    >
      <div style={{ marginBottom: 6, color: "var(--panel-ink)" }}>{TITLES[layer]}</div>
      <div style={{ height: 10, borderRadius: 5, background: gradient }} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 4,
          color: "var(--panel-ink-secondary)",
        }}
      >
        <span>{min}</span>
        <span>{mid}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
