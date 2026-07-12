import { useQuery } from "@tanstack/react-query";
import { fetchStationTable } from "@/lib/amedas";

export function useStations() {
  return useQuery({
    queryKey: ["stations"],
    queryFn: fetchStationTable,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
