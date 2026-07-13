"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useStations } from "@/hooks/useStations";
import { useLatestObservations } from "@/hooks/useLatestObservations";
import { useTodaySummaries } from "@/hooks/useStationToday";
import { MAJOR_STATION_IDS } from "@/lib/majorStations";
import { LayerSwitcher } from "./LayerSwitcher";
import { Legend } from "./Legend";
import { StatusBar } from "./StatusBar";
import type { LayerKind, TodaySummary } from "@/types/amedas";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
});

export function WeatherMap() {
  const [activeLayer, setActiveLayer] = useState<LayerKind>("currentTemp");
  const [extraTodayIds, setExtraTodayIds] = useState<string[]>([]);

  const stationsQuery = useStations();
  const observationsQuery = useLatestObservations();

  const todayStationIds = useMemo(() => {
    const base = activeLayer === "todayRange" ? MAJOR_STATION_IDS : [];
    return Array.from(new Set([...base, ...extraTodayIds]));
  }, [activeLayer, extraTodayIds]);

  const todaySummaries = useTodaySummaries(todayStationIds);

  const { todayById, todayLoadingIds } = useMemo(() => {
    const byId = new Map<string, TodaySummary>();
    const loadingIds = new Set<string>();
    todayStationIds.forEach((id, i) => {
      const result = todaySummaries[i];
      if (result?.data) byId.set(id, result.data);
      else if (result?.isLoading) loadingIds.add(id);
    });
    return { todayById: byId, todayLoadingIds: loadingIds };
  }, [todayStationIds, todaySummaries]);

  function handleMarkerClick(stationId: string) {
    setExtraTodayIds((prev) => (prev.includes(stationId) ? prev : [...prev, stationId]));
  }

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <LeafletMap
        stations={stationsQuery.data ?? []}
        observations={observationsQuery.data?.observations ?? {}}
        todayById={todayById}
        todayLoadingIds={todayLoadingIds}
        activeLayer={activeLayer}
        onMarkerClick={handleMarkerClick}
      />
      <LayerSwitcher value={activeLayer} onChange={setActiveLayer} />
      <Legend layer={activeLayer} />
      <StatusBar
        isLoading={stationsQuery.isLoading || observationsQuery.isLoading}
        isError={stationsQuery.isError || observationsQuery.isError}
        latestTime={observationsQuery.data?.latestTime}
      />
    </div>
  );
}
