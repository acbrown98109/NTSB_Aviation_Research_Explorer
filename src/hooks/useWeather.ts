import { useQuery } from '@tanstack/react-query';
import { fetchMetar, fetchMultipleMetars, metarToWeatherConditions } from '@/services/weather.service';
import type { MetarData, WeatherConditions } from '@/types';

// ============================================================
// Weather data hooks — NOAA Aviation Weather Center API
// ============================================================

/**
 * Fetches current METAR for a single ICAO station.
 * Refreshes every 20 minutes (METAR update frequency).
 */
export function useMetar(icao: string | undefined) {
  return useQuery<MetarData | null>({
    queryKey: ['metar', icao],
    queryFn: () => (icao ? fetchMetar(icao) : Promise.resolve(null)),
    enabled: !!icao,
    staleTime: 20 * 60 * 1000, // 20 min
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Fetches current METARs for multiple ICAO stations.
 */
export function useMultipleMetars(icaos: string[]) {
  return useQuery<Map<string, MetarData>>({
    queryKey: ['metars', icaos.sort().join(',')],
    queryFn: () => fetchMultipleMetars(icaos),
    enabled: icaos.length > 0,
    staleTime: 20 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Returns WeatherConditions from a raw MetarData object.
 */
export function useWeatherConditions(metar: MetarData | null | undefined): WeatherConditions | null {
  if (!metar) return null;
  return metarToWeatherConditions(metar);
}
