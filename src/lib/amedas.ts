import type { LatestObservation, StationMeta, TodaySummary } from "@/types/amedas";

const BASE_URL = "https://www.jma.go.jp/bosai/amedas";

type RawStationTable = Record<
  string,
  {
    lat: [number, number];
    lon: [number, number];
    kjName: string;
  }
>;

function toDecimalDegrees([deg, min]: [number, number]): number {
  return deg + min / 60;
}

export async function fetchStationTable(): Promise<StationMeta[]> {
  const res = await fetch(`${BASE_URL}/const/amedastable.json`);
  if (!res.ok) throw new Error(`amedastable fetch failed: ${res.status}`);
  const raw: RawStationTable = await res.json();
  return Object.entries(raw).map(([id, s]) => ({
    id,
    name: s.kjName,
    lat: toDecimalDegrees(s.lat),
    lon: toDecimalDegrees(s.lon),
  }));
}

export async function fetchLatestTime(): Promise<Date> {
  const res = await fetch(`${BASE_URL}/data/latest_time.txt`);
  if (!res.ok) throw new Error(`latest_time fetch failed: ${res.status}`);
  const text = (await res.text()).trim();
  return new Date(text);
}

function formatTimestampUtc(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    String(date.getUTCFullYear()) +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds())
  );
}

type RawLatestMap = Record<
  string,
  { temp?: [number, number]; humidity?: [number, number] }
>;

export async function fetchLatestObservations(
  latestTime: Date,
): Promise<Record<string, LatestObservation>> {
  const ts = formatTimestampUtc(latestTime);
  const res = await fetch(`${BASE_URL}/data/map/${ts}.json`);
  if (!res.ok) throw new Error(`latest observations fetch failed: ${res.status}`);
  const raw: RawLatestMap = await res.json();
  const result: Record<string, LatestObservation> = {};
  for (const [id, v] of Object.entries(raw)) {
    result[id] = {
      temp: v.temp?.[0] ?? undefined,
      humidity: v.humidity?.[0] ?? undefined,
    };
  }
  return result;
}

export function todayJst(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}${get("month")}${get("day")}`;
}

interface RawDayEntry {
  temp?: [number, number];
  maxTemp?: [number, number];
  maxTempTime?: { hour: number; minute: number };
  minTemp?: [number, number];
  minTempTime?: { hour: number; minute: number };
}

function formatHHmm(t?: { hour: number; minute: number }): string {
  if (!t) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(t.hour)}:${pad(t.minute)}`;
}

export async function fetchStationToday(
  stationId: string,
  date: string,
): Promise<TodaySummary | null> {
  const res = await fetch(`${BASE_URL}/data/point/${stationId}/${date}_00.json`);
  if (!res.ok) return null;
  const raw: Record<string, RawDayEntry> = await res.json();
  const entries = Object.entries(raw).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  if (entries.length === 0) return null;

  const [, last] = entries[entries.length - 1];
  if (last.maxTemp?.[0] == null || last.minTemp?.[0] == null) return null;

  const temps = entries
    .map(([, e]) => e.temp?.[0])
    .filter((t): t is number => t != null);
  const avg = temps.reduce((sum, t) => sum + t, 0) / temps.length;

  return {
    max: last.maxTemp[0],
    maxTime: formatHHmm(last.maxTempTime),
    min: last.minTemp[0],
    minTime: formatHHmm(last.minTempTime),
    avg,
  };
}
