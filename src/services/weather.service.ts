import type { MetarData, WeatherConditions } from '@/types';

// ============================================================
// NOAA/aviationweather.gov METAR service
// Uses the public Aviation Weather Center API (no auth required)
// ============================================================

const AWC_BASE = 'https://aviationweather.gov/api/data';

export interface MetarResponse {
  data: MetarData[];
  errors?: string[];
}

/**
 * Fetches current METAR for an ICAO station identifier.
 * Uses the Aviation Weather Center public API.
 */
export async function fetchMetar(icao: string): Promise<MetarData | null> {
  try {
    const url = `${AWC_BASE}/metar?ids=${icao}&format=json&hours=2`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`METAR fetch failed: ${response.status}`);

    const data = await response.json() as MetarData[];
    if (!Array.isArray(data) || data.length === 0) return null;

    // Return the most recent observation
    return data[0] ?? null;
  } catch {
    return null;
  }
}

/**
 * Fetches METARs for multiple stations at once.
 */
export async function fetchMultipleMetars(icaos: string[]): Promise<Map<string, MetarData>> {
  const result = new Map<string, MetarData>();
  if (icaos.length === 0) return result;

  try {
    const ids = icaos.join(',');
    const url = `${AWC_BASE}/metar?ids=${ids}&format=json&hours=2`;
    const response = await fetch(url);
    if (!response.ok) return result;

    const data = await response.json() as MetarData[];
    if (!Array.isArray(data)) return result;

    for (const metar of data) {
      if (metar.station_id && !result.has(metar.station_id)) {
        result.set(metar.station_id, metar);
      }
    }
  } catch {
    // Network unavailable — return empty map, app still works offline
  }

  return result;
}

/**
 * Converts a MetarData object to our internal WeatherConditions type.
 */
export function metarToWeatherConditions(metar: MetarData): WeatherConditions {
  const visibility = metar.visibility_statute_mi ?? 10;
  const ceiling = metar.sky_condition?.find(
    (sc) => sc.sky_cover === 'OVC' || sc.sky_cover === 'BKN'
  )?.cloud_base_ft_agl;

  const flightCategory = (metar.flight_category ?? 'VFR') as WeatherConditions['flightCategory'];

  const phenomena = metar.wx_string
    ? metar.wx_string.split(' ').filter((s) => s.length > 0)
    : [];

  const catIIIConditions =
    visibility <= 0.25 && (!ceiling || ceiling <= 100);
  const catIIConditions =
    visibility <= 0.5 && (!ceiling || ceiling <= 200) && !catIIIConditions;

  return {
    raw: metar.raw_text,
    condition: flightCategory === 'VFR' || flightCategory === 'MVFR' ? 'VMC' : 'IMC',
    visibility,
    ceiling,
    wind: metar.wind_dir_degrees !== undefined && metar.wind_speed_kt !== undefined
      ? {
          direction: metar.wind_dir_degrees,
          speed: metar.wind_speed_kt,
          gusts: metar.wind_gust_kt,
        }
      : undefined,
    temperature: metar.temp_c,
    dewpoint: metar.dewpoint_c,
    pressure: metar.altim_in_hg,
    flightCategory,
    phenomena,
    catIIIConditions,
    catIIConditions,
    nighttime: false, // computed separately based on sun position
  };
}

/**
 * Determines flight category from raw visibility and ceiling values.
 */
export function getFlightCategory(
  visibility: number,
  ceiling: number | undefined
): WeatherConditions['flightCategory'] {
  const ceilingFt = ceiling ?? 99999;

  if (visibility < 1 || ceilingFt < 500) return 'LIFR';
  if (visibility < 3 || ceilingFt < 1000) return 'IFR';
  if (visibility <= 5 || ceilingFt <= 3000) return 'MVFR';
  return 'VFR';
}

/**
 * Returns a human-readable description of flight category.
 */
export function flightCategoryDescription(category: string): string {
  switch (category) {
    case 'LIFR':
      return 'Low IFR — ceiling < 500 ft or visibility < 1 SM';
    case 'IFR':
      return 'IFR — ceiling 500–999 ft or visibility 1–2 SM';
    case 'MVFR':
      return 'Marginal VFR — ceiling 1000–3000 ft or visibility 3–5 SM';
    case 'VFR':
      return 'VFR — ceiling > 3000 ft and visibility > 5 SM';
    default:
      return 'Unknown';
  }
}
