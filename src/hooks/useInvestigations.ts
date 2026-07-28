import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Fuse, { type IFuseOptions } from 'fuse.js';
import { investigations as localData } from '@/data/investigations';
import type { Investigation, SearchFilters } from '@/types';

// ============================================================
// Investigation data hooks
// ============================================================

const fuseOptions: IFuseOptions<Investigation> = {
  keys: [
    { name: 'id', weight: 1.0 },
    { name: 'synopsis', weight: 0.9 },
    { name: 'location.city', weight: 0.8 },
    { name: 'location.airport', weight: 0.8 },
    { name: 'location.stateAbbr', weight: 0.7 },
    { name: 'probableCause', weight: 0.7 },
    { name: 'narrative', weight: 0.6 },
    { name: 'aircraft.operator', weight: 0.6 },
    { name: 'aircraft.model', weight: 0.5 },
    { name: 'aircraft.manufacturer', weight: 0.5 },
    { name: 'tags', weight: 0.5 },
    { name: 'recommendations.text', weight: 0.4 },
    { name: 'contributingFactors', weight: 0.4 },
  ],
  threshold: 0.3,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

/**
 * Loads all investigations. In production, this would hit IndexedDB;
 * here it returns the static dataset with realistic query caching.
 */
export function useAllInvestigations() {
  return useQuery({
    queryKey: ['investigations'],
    queryFn: () => Promise.resolve(localData),
    staleTime: Infinity, // static dataset never goes stale
    gcTime: Infinity,
  });
}

/**
 * Returns a single investigation by NTSB ID.
 */
export function useInvestigation(id: string | undefined) {
  const { data: all } = useAllInvestigations();
  return useMemo(
    () => (id && all ? all.find((inv) => inv.id === id) : undefined),
    [all, id]
  );
}

/**
 * Applies all active search filters to the investigation list.
 * Combines Fuse.js text search with structured field filtering.
 */
export function useFilteredInvestigations(filters: SearchFilters) {
  const { data: all = [], isLoading, error } = useAllInvestigations();

  const filtered = useMemo(() => {
    let result = all;

    // Text search via Fuse.js
    if (filters.query && filters.query.trim().length > 0) {
      const fuse = new Fuse(all, fuseOptions);
      result = fuse.search(filters.query).map((r) => r.item);
    }

    // Date range filter
    if (filters.dateRange?.start) {
      result = result.filter((inv) => inv.eventDate >= filters.dateRange!.start);
    }
    if (filters.dateRange?.end) {
      result = result.filter((inv) => inv.eventDate <= filters.dateRange!.end);
    }

    // Airport filter
    if (filters.airport) {
      const q = filters.airport.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.location.airportId?.toLowerCase() === q ||
          inv.location.airportIata?.toLowerCase() === q ||
          inv.location.airport?.toLowerCase().includes(q)
      );
    }

    // State filter
    if (filters.states && filters.states.length > 0) {
      result = result.filter((inv) =>
        filters.states!.includes(inv.location.stateAbbr)
      );
    }

    // Event type filter
    if (filters.eventTypes && filters.eventTypes.length > 0) {
      result = result.filter((inv) =>
        filters.eventTypes!.includes(inv.eventType)
      );
    }

    // Sub type filter
    if (filters.subTypes && filters.subTypes.length > 0) {
      result = result.filter((inv) =>
        filters.subTypes!.includes(inv.subType)
      );
    }

    // Severity filter
    if (filters.severity && filters.severity.length > 0) {
      result = result.filter((inv) =>
        filters.severity!.includes(inv.severity)
      );
    }

    // Runway incursion category filter
    if (filters.runwayIncursionCategories && filters.runwayIncursionCategories.length > 0) {
      result = result.filter(
        (inv) =>
          inv.runwayIncursion &&
          filters.runwayIncursionCategories!.includes(inv.runwayIncursion.category)
      );
    }

    // Weather / flight category filter
    if (filters.flightCategories && filters.flightCategories.length > 0) {
      result = result.filter((inv) =>
        filters.flightCategories!.includes(inv.weather.flightCategory)
      );
    }

    // Nighttime filter
    if (filters.nighttime !== undefined) {
      result = result.filter((inv) => inv.weather.nighttime === filters.nighttime);
    }

    // Aircraft manufacturer filter
    if (filters.aircraftManufacturers && filters.aircraftManufacturers.length > 0) {
      result = result.filter((inv) =>
        inv.aircraft.some((a) =>
          filters.aircraftManufacturers!.includes(a.manufacturer)
        )
      );
    }

    // Operator filter
    if (filters.operators && filters.operators.length > 0) {
      result = result.filter((inv) =>
        inv.aircraft.some((a) =>
          a.operator && filters.operators!.some((op) =>
            a.operator!.toLowerCase().includes(op.toLowerCase())
          )
        )
      );
    }

    // Human factors filter
    if (filters.humanFactors && filters.humanFactors.length > 0) {
      result = result.filter((inv) =>
        inv.humanFactors.some((hf) =>
          filters.humanFactors!.includes(hf.category)
        )
      );
    }

    // Infrastructure filter
    if (filters.infrastructureCategories && filters.infrastructureCategories.length > 0) {
      result = result.filter((inv) =>
        inv.infrastructure.some((inf) =>
          filters.infrastructureCategories!.includes(inf.category)
        )
      );
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      result = result.filter((inv) =>
        filters.status!.includes(inv.status)
      );
    }

    // Has recommendations filter
    if (filters.hasRecommendations !== undefined) {
      result = result.filter(
        (inv) =>
          (inv.recommendations.length > 0) === filters.hasRecommendations
      );
    }

    return result;
  }, [all, filters]);

  return { data: filtered, isLoading, error };
}

/**
 * Returns derived analytics counts from a list of investigations.
 */
export function useInvestigationStats(investigations: Investigation[]) {
  return useMemo(() => {
    const total = investigations.length;
    const runwayIncursions = investigations.filter((i) => i.subType === 'runway_incursion').length;
    const catA = investigations.filter((i) => i.runwayIncursion?.category === 'A').length;
    const catB = investigations.filter((i) => i.runwayIncursion?.category === 'B').length;
    const catC = investigations.filter((i) => i.runwayIncursion?.category === 'C').length;
    const catD = investigations.filter((i) => i.runwayIncursion?.category === 'D').length;
    const nearMidair = investigations.filter((i) => i.subType === 'near_midair_collision').length;
    const fatal = investigations.filter((i) => i.severity === 'fatal').length;
    const allRecs = investigations.flatMap((i) => i.recommendations);
    const openRecs = allRecs.filter((r) => r.status === 'open').length;
    const closedRecs = allRecs.filter((r) => r.status === 'closed').length;

    return {
      total,
      runwayIncursions,
      catA,
      catB,
      catC,
      catD,
      nearMidair,
      fatal,
      incidents: investigations.filter((i) => i.eventType === 'incident').length,
      openRecs,
      closedRecs,
    };
  }, [investigations]);
}
