"use client";

import type { LayerKind } from "@/types/amedas";

const LAYERS: ReadonlyArray<{ key: LayerKind; label: string }> = [
  { key: "currentTemp", label: "現在の気温" },
  { key: "humidity", label: "現在の湿度" },
  { key: "todayRange", label: "本日の最高気温" },
];

interface LayerSwitcherProps {
  value: LayerKind;
  onChange: (layer: LayerKind) => void;
}

export function LayerSwitcher({ value, onChange }: LayerSwitcherProps) {
  return (
    <div
      role="group"
      aria-label="表示するレイヤーの選択"
      style={{
        position: "absolute",
        zIndex: 1000,
        top: 12,
        left: 12,
        maxWidth: "calc(100vw - 24px)",
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        background: "var(--panel-surface)",
        borderRadius: 8,
        padding: 4,
        boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
      }}
    >
      {LAYERS.map((l) => (
        <button
          key={l.key}
          type="button"
          aria-pressed={value === l.key}
          onClick={() => onChange(l.key)}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            background: value === l.key ? "var(--panel-accent)" : "transparent",
            color: value === l.key ? "#ffffff" : "var(--panel-ink)",
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
