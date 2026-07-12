"use client";

import { useMemo, useState } from "react";
import { Map as GoogleMap } from "@vis.gl/react-google-maps";
import { useStations } from "@/hooks/useStations";
import { useLatestObservations } from "@/hooks/useLatestObservations";
import { useTodaySummaries } from "@/hooks/useStationToday";
import { MAJOR_STATION_IDS } from "@/lib/majorStations";
import { StationMarkers } from "./StationMarkers";
import { StationInfoWindow } from "./StationInfoWindow";
import { LayerSwitcher } from "./LayerSwitcher";
import { Legend } from "./Legend";
import type { LayerKind, TodaySummary } from "@/types/amedas";

const JAPAN_CENTER = { lat: 36.5, lng: 137.5 };
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "DEMO_MAP_ID";

export function WeatherMap() {
  const [activeLayer, setActiveLayer] = useState<LayerKind>("currentTemp");
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [extraTodayIds, setExtraTodayIds] = useState<string[]>([]);

  const stationsQuery = useStations();
  const observationsQuery = useLatestObservations();

  const todayStationIds = useMemo(() => {
    const base = activeLayer === "todayRange" ? MAJOR_STATION_IDS : [];
    return Array.from(new Set([...base, ...extraTodayIds]));
  }, [activeLayer, extraTodayIds]);

  const todaySummaries = useTodaySummaries(todayStationIds);

  const todayById = useMemo(() => {
    const map = new Map<string, TodaySummary>();
    todayStationIds.forEach((id, i) => {
      const data = todaySummaries[i]?.data;
      if (data) map.set(id, data);
    });
    return map;
  }, [todayStationIds, todaySummaries]);

  const stationsById = useMemo(() => {
    const map = new Map(stationsQuery.data?.map((s) => [s.id, s]));
    return map;
  }, [stationsQuery.data]);

  const selectedTodayResult = useMemo(() => {
    if (!selectedStationId) return undefined;
    const idx = todayStationIds.indexOf(selectedStationId);
    return idx >= 0 ? todaySummaries[idx] : undefined;
  }, [selectedStationId, todayStationIds, todaySummaries]);

  function handleMarkerClick(stationId: string) {
    setSelectedStationId(stationId);
    setExtraTodayIds((prev) => (prev.includes(stationId) ? prev : [...prev, stationId]));
  }

  const selectedStation = selectedStationId ? stationsById.get(selectedStationId) : undefined;

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <GoogleMap
        mapId={MAP_ID}
        defaultCenter={JAPAN_CENTER}
        defaultZoom={5}
        gestureHandling="greedy"
        disableDefaultUI={false}
        style={{ width: "100%", height: "100%" }}
      >
        <StationMarkers
          stations={stationsQuery.data ?? []}
          observations={observationsQuery.data?.observations ?? {}}
          todayById={todayById}
          activeLayer={activeLayer}
          onMarkerClick={handleMarkerClick}
        />
        {selectedStation && (
          <StationInfoWindow
            station={selectedStation}
            observation={observationsQuery.data?.observations[selectedStation.id]}
            today={selectedTodayResult?.data ?? undefined}
            todayLoading={selectedTodayResult?.isLoading ?? false}
            onClose={() => setSelectedStationId(null)}
          />
        )}
      </GoogleMap>
      <LayerSwitcher value={activeLayer} onChange={setActiveLayer} />
      <Legend layer={activeLayer} />
    </div>
  );
}
