// ============================================================
// Core domain types for NTSB Aviation Research Explorer
// ============================================================

export type EventType = 'accident' | 'incident';
export type EventSubType =
  | 'runway_incursion'
  | 'near_midair_collision'
  | 'ground_collision'
  | 'loss_of_separation'
  | 'runway_excursion'
  | 'controlled_flight_into_terrain'
  | 'other';

export type InjurySeverity = 'fatal' | 'serious' | 'minor' | 'none';
export type RunwayIncursionCategory = 'A' | 'B' | 'C' | 'D';
export type InvestigationStatus = 'open' | 'closed' | 'preliminary';
export type WeatherCondition = 'VMC' | 'IMC' | 'MVMC';
export type FlightPhase =
  | 'takeoff'
  | 'landing'
  | 'taxi'
  | 'approach'
  | 'cruise'
  | 'climb'
  | 'descent'
  | 'ground';

// ── Human Factors ────────────────────────────────────────────
export type HumanFactorCategory =
  | 'expectation_bias'
  | 'situational_awareness'
  | 'communication'
  | 'decision_making'
  | 'workload'
  | 'fatigue'
  | 'automation'
  | 'procedural_deviation'
  | 'complacency'
  | 'crew_resource_management';

export interface HumanFactor {
  category: HumanFactorCategory;
  confidence: number; // 0–100
  description: string;
  parties: string[]; // e.g., ['pilot', 'controller']
}

// ── Infrastructure ───────────────────────────────────────────
export type InfrastructureCategory =
  | 'surface_radar'
  | 'runway_status_lights'
  | 'airport_geometry'
  | 'lighting'
  | 'signage'
  | 'construction'
  | 'asde_x'
  | 'assc'
  | 'ground_radar'
  | 'taxiway_design'
  | 'approach_aids';

export interface InfrastructureIssue {
  category: InfrastructureCategory;
  description: string;
  present: boolean; // whether the infrastructure was present and functioning
  contributed: boolean; // whether its absence/failure contributed
}

// ── Weather ──────────────────────────────────────────────────
export interface WeatherConditions {
  raw?: string; // raw METAR string
  condition: WeatherCondition;
  visibility: number; // statute miles
  ceiling?: number; // AGL feet
  wind?: { direction: number; speed: number; gusts?: number };
  temperature?: number; // Celsius
  dewpoint?: number; // Celsius
  pressure?: number; // inHg
  flightCategory: 'VFR' | 'MVFR' | 'IFR' | 'LIFR';
  phenomena?: string[]; // FG, BR, RA, SN, etc.
  catIIIConditions?: boolean;
  catIIConditions?: boolean;
  nighttime: boolean;
}

// ── Aircraft ─────────────────────────────────────────────────
export interface Aircraft {
  registration?: string;
  manufacturer: string;
  model: string;
  category: 'large_transport' | 'small_transport' | 'regional' | 'general_aviation' | 'military';
  operator?: string;
  flightNumber?: string;
  flightPhase: FlightPhase;
  role: 'primary' | 'secondary' | 'tertiary';
  crew?: number;
  passengers?: number;
  cargo?: boolean;
}

// ── Recommendations ──────────────────────────────────────────
export type RecommendationStatus = 'open' | 'closed' | 'superseded' | 'unacceptable';
export type RecommendationRecipient = 'FAA' | 'ICAO' | 'airport' | 'airline' | 'ATC' | 'manufacturer' | 'DOT' | 'other';

export interface Recommendation {
  id: string; // e.g., "A-23-016"
  text: string;
  recipient: RecommendationRecipient;
  recipientName: string;
  status: RecommendationStatus;
  issueDate: string;
  closedDate?: string;
  closedDescription?: string;
  investigationId: string;
  category: string;
  priority: 'urgent' | 'priority' | 'routine';
}

// ── Timeline ─────────────────────────────────────────────────
export interface TimelineEvent {
  time: string; // HH:MM or HH:MM:SS
  description: string;
  category: 'atc' | 'aircraft' | 'weather' | 'infrastructure' | 'crew' | 'system';
  critical?: boolean;
}

// ── Investigation ────────────────────────────────────────────
export interface Investigation {
  id: string; // NTSB identifier e.g., "DCA23MA142"
  eventDate: string; // ISO date YYYY-MM-DD
  eventTime: string; // local time HH:MM
  localTimezone: string; // e.g., "America/Chicago"

  location: {
    city: string;
    state: string;
    stateAbbr: string;
    country: string;
    airport?: string;
    airportId?: string; // ICAO
    airportIata?: string;
    coordinates?: { lat: number; lng: number };
  };

  eventType: EventType;
  subType: EventSubType;
  severity: InjurySeverity;
  status: InvestigationStatus;

  runwayIncursion?: {
    category: RunwayIncursionCategory;
    runway: string;
    conflictType: string;
  };

  aircraft: Aircraft[];
  weather: WeatherConditions;

  narrative: string;
  probableCause: string;
  contributingFactors: string[];

  recommendations: Recommendation[];
  humanFactors: HumanFactor[];
  infrastructure: InfrastructureIssue[];

  injuries: { fatal: number; serious: number; minor: number; none: number };

  reportUrl?: string;
  docketUrl?: string;

  timeline: TimelineEvent[];

  tags: string[]; // free-form tags for search
  synopsis: string; // short 1-2 sentence summary
}

// ── Airport Database ─────────────────────────────────────────
export interface RunwayInfo {
  designator: string;
  length: number; // feet
  width: number; // feet
  surface: string;
  ils?: boolean;
  catII?: boolean;
  catIII?: boolean;
}

export interface Airport {
  icao: string;
  iata: string;
  name: string;
  city: string;
  state: string;
  stateAbbr: string;
  coordinates: { lat: number; lng: number };
  elevation: number; // feet MSL
  runways: RunwayInfo[];
  towered: boolean;
  tracon?: string;
  center?: string;
  approachTypes: string[];
  surfaceRadar: boolean;
  asdeX: boolean;
  assc: boolean;
  annualOperations?: number;
  incidentCount?: number; // computed
}

// ── Research Notebook ────────────────────────────────────────
export interface NotebookEntry {
  id: string;
  investigationId: string;
  type: 'bookmark' | 'note' | 'highlight';
  content?: string; // for notes and highlights
  highlightedText?: string;
  color?: string; // highlight color
  createdAt: string;
  updatedAt: string;
  tags: string[];
  folder?: string;
}

export interface NotebookFolder {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface ResearchProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  investigationIds: string[];
  tags: string[];
  folders: NotebookFolder[];
  notes: NotebookEntry[];
}

// ── Search & Filter ──────────────────────────────────────────
export interface SearchFilters {
  query: string;
  dateRange?: { start: string; end: string };
  airport?: string;
  states?: string[];
  aircraftManufacturers?: string[];
  aircraftModels?: string[];
  operators?: string[];
  eventTypes?: EventType[];
  subTypes?: EventSubType[];
  severity?: InjurySeverity[];
  runwayIncursionCategories?: RunwayIncursionCategory[];
  weatherConditions?: string[];
  flightCategories?: string[];
  nighttime?: boolean;
  humanFactors?: HumanFactorCategory[];
  infrastructureCategories?: InfrastructureCategory[];
  status?: InvestigationStatus[];
  hasRecommendations?: boolean;
}

// ── Analytics ────────────────────────────────────────────────
export interface AnalyticsSummary {
  totalInvestigations: number;
  totalRunwayIncursions: number;
  categoryA: number;
  categoryB: number;
  categoryC: number;
  categoryD: number;
  nearMidair: number;
  fatalAccidents: number;
  incidents: number;
  openRecommendations: number;
  closedRecommendations: number;
  totalFatalities: number;
}

export interface YearlyTrend {
  year: number;
  total: number;
  runwayIncursions: number;
  categoryA: number;
  categoryB: number;
  fatal: number;
  incidents: number;
}

// ── Citation ─────────────────────────────────────────────────
export type CitationFormat = 'APA' | 'MLA' | 'Chicago' | 'IEEE';

export interface Citation {
  investigation: Investigation;
  format: CitationFormat;
  text: string;
}

// ── NOAA Weather API ─────────────────────────────────────────
export interface MetarData {
  station_id: string;
  observation_time: string;
  raw_text: string;
  temp_c?: number;
  dewpoint_c?: number;
  wind_dir_degrees?: number;
  wind_speed_kt?: number;
  wind_gust_kt?: number;
  visibility_statute_mi?: number;
  sky_condition?: Array<{ sky_cover: string; cloud_base_ft_agl?: number }>;
  flight_category: string;
  wx_string?: string;
  altim_in_hg?: number;
}

// ── Export ───────────────────────────────────────────────────
export type ExportFormat = 'csv' | 'json' | 'pdf' | 'markdown';

export interface ExportOptions {
  format: ExportFormat;
  investigations: Investigation[];
  includeNarrative: boolean;
  includeRecommendations: boolean;
  includeTimeline: boolean;
  includeHumanFactors: boolean;
  citationFormat?: CitationFormat;
}

// ── Settings ─────────────────────────────────────────────────
export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  defaultMapView: 'standard' | 'satellite' | 'terrain';
  resultsPerPage: number;
  defaultSort: 'date_desc' | 'date_asc' | 'severity' | 'relevance';
  autoSync: boolean;
  showWeather: boolean;
  compactView: boolean;
  defaultCitationFormat: CitationFormat;
  keyboardShortcuts: boolean;
  animationsEnabled: boolean;
  geminiApiKey: string;
}
