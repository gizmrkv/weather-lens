"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";
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
  activeLayer: LayerKind;
  onMarkerClick: (stationId: string) => void;
}

export function StationMarkers({
  stations,
  observations,
  todayById,
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

        return (
          <AdvancedMarker
            key={station.id}
            position={{ lat: station.lat, lng: station.lon }}
            onClick={() => onMarkerClick(station.id)}
          >
            <div
              style={{
                width: hasValue ? 14 : 10,
                height: hasValue ? 14 : 10,
                borderRadius: "50%",
                background: color,
                border: hasValue ? "2px solid #fcfcfb" : "1.5px solid #898781",
                boxShadow: "0 0 2px rgba(0,0,0,0.4)",
                cursor: "pointer",
              }}
            />
          </AdvancedMarker>
        );
      })}
    </>
  );
}
