"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { StationMarkers } from "./StationMarkers";
import type {
  LatestObservation,
  LayerKind,
  StationMeta,
  TodaySummary,
} from "@/types/amedas";

const JAPAN_CENTER: [number, number] = [36.5, 137.5];
const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

interface LeafletMapProps {
  stations: StationMeta[];
  observations: Record<string, LatestObservation>;
  todayById: Map<string, TodaySummary>;
  todayLoadingIds: Set<string>;
  activeLayer: LayerKind;
  onMarkerClick: (stationId: string) => void;
}

export default function LeafletMap({
  stations,
  observations,
  todayById,
  todayLoadingIds,
  activeLayer,
  onMarkerClick,
}: LeafletMapProps) {
  return (
    <MapContainer
      center={JAPAN_CENTER}
      zoom={5}
      zoomControl={false}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      <ZoomControl position="bottomright" />
      <StationMarkers
        stations={stations}
        observations={observations}
        todayById={todayById}
        todayLoadingIds={todayLoadingIds}
        activeLayer={activeLayer}
        onMarkerClick={onMarkerClick}
      />
    </MapContainer>
  );
}
