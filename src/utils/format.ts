import { format, parseISO } from 'date-fns';
import type {
  Investigation,
  RunwayIncursionCategory,
  HumanFactorCategory,
  InfrastructureCategory,
  WeatherConditions,
} from '@/types';

// ============================================================
// Formatting utilities
// ============================================================

export function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'MMMM d, yyyy');
}

export function formatDateShort(dateString: string): string {
  return format(parseISO(dateString), 'MMM d, yyyy');
}

export function formatDateTime(dateString: string, timeString: string): string {
  return `${format(parseISO(dateString), 'MMM d, yyyy')} at ${timeString}`;
}

export function getYear(dateString: string): number {
  return new Date(dateString).getFullYear();
}

export function formatSubType(subType: Investigation['subType']): string {
  const labels: Record<Investigation['subType'], string> = {
    runway_incursion: 'Runway Incursion',
    near_midair_collision: 'Near Midair Collision',
    ground_collision: 'Ground Collision',
    loss_of_separation: 'Loss of Separation',
    runway_excursion: 'Runway Excursion',
    controlled_flight_into_terrain: 'CFIT',
    other: 'Other',
  };
  return labels[subType] ?? subType;
}

export function formatSeverity(severity: Investigation['severity']): string {
  const labels: Record<Investigation['severity'], string> = {
    fatal: 'Fatal',
    serious: 'Serious',
    minor: 'Minor',
    none: 'No Injury',
  };
  return labels[severity];
}

export function formatHumanFactor(category: HumanFactorCategory): string {
  const labels: Record<HumanFactorCategory, string> = {
    expectation_bias: 'Expectation Bias',
    situational_awareness: 'Situational Awareness',
    communication: 'Communication',
    decision_making: 'Decision Making',
    workload: 'Workload',
    fatigue: 'Fatigue',
    automation: 'Automation',
    procedural_deviation: 'Procedural Deviation',
    complacency: 'Complacency',
    crew_resource_management: 'CRM',
  };
  return labels[category] ?? category;
}

export function formatInfrastructureCategory(category: InfrastructureCategory): string {
  const labels: Record<InfrastructureCategory, string> = {
    surface_radar: 'Surface Radar',
    runway_status_lights: 'Runway Status Lights',
    airport_geometry: 'Airport Geometry',
    lighting: 'Lighting',
    signage: 'Signage / Markings',
    construction: 'Construction / NOTAM',
    asde_x: 'ASDE-X',
    assc: 'ASSC',
    ground_radar: 'Ground Radar',
    taxiway_design: 'Taxiway Design',
    approach_aids: 'Approach Aids',
  };
  return labels[category] ?? category;
}

export function formatRunwayCategory(category: RunwayIncursionCategory): string {
  const descriptions: Record<RunwayIncursionCategory, string> = {
    A: 'Category A — Serious Incident (Separation Precluded)',
    B: 'Category B — Significant Potential for Collision',
    C: 'Category C — Ample Time/Distance to Avoid',
    D: 'Category D — Little or No Chance of Collision',
  };
  return descriptions[category];
}

export function formatWeatherConditions(weather: WeatherConditions): string {
  const parts: string[] = [];
  parts.push(`${weather.flightCategory}`);
  parts.push(`${weather.visibility} SM`);
  if (weather.ceiling) parts.push(`Ceiling ${weather.ceiling.toLocaleString()} ft`);
  if (weather.wind) {
    parts.push(`Wind ${weather.wind.direction.toString().padStart(3, '0')}° at ${weather.wind.speed} kt`);
  }
  return parts.join(' | ');
}

export function formatVisibility(miles: number): string {
  if (miles < 1) return `${(miles * 5280).toFixed(0)} ft (${miles} SM)`;
  return `${miles} SM`;
}

export function severityColor(severity: Investigation['severity']): string {
  const colors: Record<Investigation['severity'], string> = {
    fatal: 'text-red-400',
    serious: 'text-orange-400',
    minor: 'text-yellow-400',
    none: 'text-green-400',
  };
  return colors[severity];
}

export function flightCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    VFR: 'text-green-400',
    MVFR: 'text-blue-400',
    IFR: 'text-red-400',
    LIFR: 'text-purple-400',
  };
  return colors[category] ?? 'text-slate-400';
}

export function flightCategoryBg(category: string): string {
  const colors: Record<string, string> = {
    VFR: 'bg-green-500/20 text-green-300 border border-green-500/30',
    MVFR: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    IFR: 'bg-red-500/20 text-red-300 border border-red-500/30',
    LIFR: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  };
  return colors[category] ?? 'bg-slate-500/20 text-slate-300';
}

export function runwayCategoryBg(category: RunwayIncursionCategory): string {
  const colors: Record<RunwayIncursionCategory, string> = {
    A: 'bg-red-500/20 text-red-300 border border-red-500/30',
    B: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
    C: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    D: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  };
  return colors[category];
}

export function humanFactorColor(confidence: number): string {
  if (confidence >= 85) return 'text-red-400';
  if (confidence >= 70) return 'text-orange-400';
  if (confidence >= 55) return 'text-yellow-400';
  return 'text-slate-400';
}

export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + '...';
}

export function formatNtsbId(id: string): string {
  // e.g., DCA23MA142 → DCA-23-MA-142
  return id.replace(/^([A-Z]{3})(\d{2})([A-Z]{2})(\d+)$/, '$1-$2-$3-$4');
}
