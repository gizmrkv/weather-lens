"use client";

import { InfoWindow } from "@vis.gl/react-google-maps";
import type { LatestObservation, StationMeta, TodaySummary } from "@/types/amedas";

interface StationInfoWindowProps {
  station: StationMeta;
  observation: LatestObservation | undefined;
  today: TodaySummary | undefined;
  todayLoading: boolean;
  onClose: () => void;
}

export function StationInfoWindow({
  station,
  observation,
  today,
  todayLoading,
  onClose,
}: StationInfoWindowProps) {
  return (
    <InfoWindow
      position={{ lat: station.lat, lng: station.lon }}
      onCloseClick={onClose}
    >
      <div style={{ fontSize: 13, lineHeight: 1.7, minWidth: 150 }}>
        <strong>{station.name}</strong>
        <div>気温: {observation?.temp != null ? `${observation.temp}℃` : "—"}</div>
        <div>湿度: {observation?.humidity != null ? `${observation.humidity}%` : "—"}</div>
        <div>
          本日最高: {today ? `${today.max}℃ (${today.maxTime})` : todayLoading ? "取得中…" : "—"}
        </div>
        <div>
          本日最低: {today ? `${today.min}℃ (${today.minTime})` : todayLoading ? "取得中…" : "—"}
        </div>
        <div>本日平均: {today ? `${today.avg.toFixed(1)}℃` : todayLoading ? "取得中…" : "—"}</div>
      </div>
    </InfoWindow>
  );
}
