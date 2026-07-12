import { useQueries } from "@tanstack/react-query";
import { fetchStationToday, todayJst } from "@/lib/amedas";
import { getCached, setCached } from "@/lib/cache";
import type { TodaySummary } from "@/types/amedas";

async function fetchStationTodayCached(
  stationId: string,
  date: string,
): Promise<TodaySummary | null> {
  const cacheKey = `amedas:today:${date}:${stationId}`;
  const cached = getCached<TodaySummary>(cacheKey);
  if (cached) return cached;
  const summary = await fetchStationToday(stationId, date);
  if (summary) setCached(cacheKey, summary);
  return summary;
}

export function useTodaySummaries(stationIds: string[]) {
  const date = todayJst();
  return useQueries({
    queries: stationIds.map((id) => ({
      queryKey: ["stationToday", id, date],
      queryFn: () => fetchStationTodayCached(id, date),
      staleTime: Infinity,
    })),
  });
}
