import { useQuery } from "@tanstack/react-query";
import { fetchLatestObservations, fetchLatestTime } from "@/lib/amedas";

export function useLatestObservations() {
  return useQuery({
    queryKey: ["latestObservations"],
    queryFn: async () => {
      const latestTime = await fetchLatestTime();
      const observations = await fetchLatestObservations(latestTime);
      return { latestTime, observations };
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
}
