export type LayerKind = "currentTemp" | "humidity" | "todayRange";

export interface StationMeta {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface LatestObservation {
  temp?: number;
  humidity?: number;
}

export interface TodaySummary {
  max: number;
  maxTime: string;
  min: number;
  minTime: string;
  avg: number;
}
