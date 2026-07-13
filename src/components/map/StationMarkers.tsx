"use client";

import { CircleMarker, Popup } from "react-leaflet";
import { colorFor } from "@/lib/colorScale";
import type {
  LatestObservation,
  LayerKind,
  StationMeta,
  TodaySummary,
} from "@/types/amedas";

interface StationMarkersProps {
  stations: StationMeta[];
  observations: Record<string, LatestObservation>;
  todayById: Map<string, TodaySummary>;
  todayLoadingIds: Set<string>;
  activeLayer: LayerKind;
  onMarkerClick: (stationId: string) => void;
}

export function StationMarkers({
  stations,
  observations,
  todayById,
  todayLoadingIds,
  activeLayer,
  onMarkerClick,
}: StationMarkersProps) {
  return (
    <>
      {stations.map((station) => {
        const obs = observations[station.id];

        let value: number | undefined;
        let eligible: boolean;
        if (activeLayer === "currentTemp") {
          value = obs?.temp;
          eligible = obs?.temp != null;
        } else if (activeLayer === "humidity") {
          value = obs?.humidity;
          eligible = obs?.humidity != null;
        } else {
          value = todayById.get(station.id)?.max;
          eligible = obs?.temp != null;
        }

        if (!eligible) return null;

        const color = colorFor(activeLayer, value);
        const hasValue = value != null;
        const today = todayById.get(station.id);
        const todayLoading = todayLoadingIds.has(station.id);

        return (
          <CircleMarker
            key={station.id}
            center={[station.lat, station.lon]}
            radius={hasValue ? 7 : 5}
            pathOptions={{
              color: hasValue ? "#fcfcfb" : "#898781",
              weight: hasValue ? 2 : 1.5,
              fillColor: color,
              fillOpacity: 1,
            }}
            eventHandlers={{ click: () => onMarkerClick(station.id) }}
          >
            <Popup>
              <div style={{ fontSize: 13, lineHeight: 1.7, minWidth: 150 }}>
                <strong>{station.name}</strong>
                <div>気温: {obs?.temp != null ? `${obs.temp}℃` : "—"}</div>
                <div>湿度: {obs?.humidity != null ? `${obs.humidity}%` : "—"}</div>
                <div>
                  本日最高:{" "}
                  {today ? `${today.max}℃ (${today.maxTime})` : todayLoading ? "取得中…" : "—"}
                </div>
                <div>
                  本日最低:{" "}
                  {today ? `${today.min}℃ (${today.minTime})` : todayLoading ? "取得中…" : "—"}
                </div>
                <div>本日平均: {today ? `${today.avg.toFixed(1)}℃` : todayLoading ? "取得中…" : "—"}</div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}
