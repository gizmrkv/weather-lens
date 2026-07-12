import { scaleLinear } from "d3-scale";
import type { LayerKind } from "@/types/amedas";

// dataviz skill: diverging (blue↔red, neutral gray midpoint) for temperature
// polarity around a comfortable baseline, sequential (one hue, light→dark)
// for humidity magnitude. Hex values are the documented blue/red/neutral
// slots from the skill's reference palette.
const TEMP_COLD = "#184f95";
const TEMP_NEUTRAL = "#f0efec";
const TEMP_HOT = "#e34948";
const TEMP_NEUTRAL_C = 15;

const HUMIDITY_LOW = "#cde2fb";
const HUMIDITY_HIGH = "#0d366b";

export const NEUTRAL_MARKER = "#c3c2b7";

export const TEMP_DOMAIN: readonly [number, number] = [-10, 40];
export const HUMIDITY_DOMAIN: readonly [number, number] = [0, 100];

export const tempScale = scaleLinear<string>()
  .domain([TEMP_DOMAIN[0], TEMP_NEUTRAL_C, TEMP_DOMAIN[1]])
  .range([TEMP_COLD, TEMP_NEUTRAL, TEMP_HOT])
  .clamp(true);

export const humidityScale = scaleLinear<string>()
  .domain(HUMIDITY_DOMAIN as [number, number])
  .range([HUMIDITY_LOW, HUMIDITY_HIGH])
  .clamp(true);

export function colorFor(layer: LayerKind, value: number | undefined): string {
  if (value == null) return NEUTRAL_MARKER;
  return layer === "humidity" ? humidityScale(value) : tempScale(value);
}
