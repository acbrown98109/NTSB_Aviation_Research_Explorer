import type {
  Investigation,
  HumanFactor,
  HumanFactorCategory,
  InfrastructureIssue,
  InfrastructureCategory,
  AnalyticsSummary,
  YearlyTrend,
} from '@/types';

// ============================================================
// Analysis service — extracts insights from investigation data
// ============================================================

const HUMAN_FACTOR_KEYWORDS: Record<HumanFactorCategory, string[]> = {
  expectation_bias: [
    'expectation', 'expected', 'assumed', 'anticipated', 'believed',
    'thought', 'mental model', 'confirmation bias',
  ],
  situational_awareness: [
    'situational awareness', 'lost awareness', 'unaware', 'did not see',
    'failed to observe', 'position', 'did not notice', 'lost track',
  ],
  communication: [
    'communication', 'phraseology', 'misunderstood', 'miscommunication',
    'frequency', 'radio', 'readback', 'hearback', 'ambiguous',
  ],
  decision_making: [
    'decision', 'judgment', 'chose to', 'decided', 'assessment',
    'risk assessment', 'determined',
  ],
  workload: [
    'workload', 'busy', 'task saturation', 'overloaded', 'distracted',
    'multiple tasks', 'high demand',
  ],
  fatigue: [
    'fatigue', 'tired', 'rest', 'duty time', 'sleep', 'circadian',
    'rest period', 'hours of service',
  ],
  automation: [
    'automation', 'autopilot', 'autothrottle', 'TCAS', 'automation bias',
    'mode confusion', 'LNAV', 'VNAV',
  ],
  procedural_deviation: [
    'procedure', 'checklist', 'failed to', 'did not comply', 'deviated',
    'non-standard', 'violation', 'protocol', 'hold short',
  ],
  complacency: [
    'complacency', 'routine', 'familiar', 'over-confident', 'assumed safe',
    'did not verify', 'relied on',
  ],
  crew_resource_management: [
    'CRM', 'crew resource', 'coordination', 'teamwork', 'assertiveness',
    'challenge', 'monitoring', 'cross-check',
  ],
};

const INFRASTRUCTURE_KEYWORDS: Record<InfrastructureCategory, string[]> = {
  surface_radar: ['surface radar', 'ground radar', 'surface surveillance', 'AMASS'],
  runway_status_lights: ['runway status light', 'RWSL', 'takeoff hold light', 'THL', 'runway entrance light', 'REL'],
  airport_geometry: ['geometry', 'layout', 'configuration', 'complex intersection', 'converging'],
  lighting: ['lighting', 'lights', 'illumination', 'visibility of runway', 'edge lights'],
  signage: ['signage', 'sign', 'marking', 'hold short marking', 'painted', 'painted marking'],
  construction: ['construction', 'NOTAM', 'closed runway', 'work in progress'],
  asde_x: ['ASDE-X', 'ASDE X', 'Airport Surface Detection Equipment'],
  assc: ['ASSC', 'Airport Surface Surveillance Capability'],
  ground_radar: ['ground radar', 'ASDE', 'ground movement radar'],
  taxiway_design: ['taxiway design', 'taxiway layout', 'parallel taxiway', 'rapid exit'],
  approach_aids: ['ILS', 'localizer', 'glideslope', 'approach lighting', 'PAPI', 'VASI'],
};

/**
 * Extracts human factors from narrative text using keyword matching.
 * Returns factors sorted by confidence descending.
 */
export function extractHumanFactors(text: string): HumanFactor[] {
  const lowerText = text.toLowerCase();
  const factors: HumanFactor[] = [];

  for (const [category, keywords] of Object.entries(HUMAN_FACTOR_KEYWORDS)) {
    const matches = keywords.filter((kw) => lowerText.includes(kw.toLowerCase()));
    if (matches.length > 0) {
      const confidence = Math.min(95, 50 + matches.length * 15);
      factors.push({
        category: category as HumanFactorCategory,
        confidence,
        description: `Detected based on narrative keywords: ${matches.slice(0, 3).join(', ')}`,
        parties: [],
      });
    }
  }

  return factors.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Extracts infrastructure issues from narrative text.
 */
export function extractInfrastructureIssues(text: string): InfrastructureIssue[] {
  const lowerText = text.toLowerCase();
  const issues: InfrastructureIssue[] = [];

  for (const [category, keywords] of Object.entries(INFRASTRUCTURE_KEYWORDS)) {
    const matches = keywords.filter((kw) => lowerText.includes(kw.toLowerCase()));
    if (matches.length > 0) {
      const absenceIndicators = ['not equipped', 'no ', 'absence', 'lacked', 'without'];
      const isAbsent = absenceIndicators.some((ind) =>
        matches.some((kw) => {
          const idx = lowerText.indexOf(kw.toLowerCase());
          const surrounding = lowerText.slice(Math.max(0, idx - 50), idx + kw.length + 50);
          return surrounding.includes(ind);
        })
      );

      issues.push({
        category: category as InfrastructureCategory,
        description: `Referenced in narrative: ${matches.slice(0, 2).join(', ')}`,
        present: !isAbsent,
        contributed: isAbsent,
      });
    }
  }

  return issues;
}

/**
 * Computes an overall analytics summary from an array of investigations.
 */
export function computeAnalyticsSummary(investigations: Investigation[]): AnalyticsSummary {
  return {
    totalInvestigations: investigations.length,
    totalRunwayIncursions: investigations.filter((i) => i.subType === 'runway_incursion').length,
    categoryA: investigations.filter((i) => i.runwayIncursion?.category === 'A').length,
    categoryB: investigations.filter((i) => i.runwayIncursion?.category === 'B').length,
    categoryC: investigations.filter((i) => i.runwayIncursion?.category === 'C').length,
    categoryD: investigations.filter((i) => i.runwayIncursion?.category === 'D').length,
    nearMidair: investigations.filter((i) => i.subType === 'near_midair_collision').length,
    fatalAccidents: investigations.filter((i) => i.severity === 'fatal').length,
    incidents: investigations.filter((i) => i.eventType === 'incident').length,
    openRecommendations: investigations.flatMap((i) => i.recommendations).filter((r) => r.status === 'open').length,
    closedRecommendations: investigations.flatMap((i) => i.recommendations).filter((r) => r.status === 'closed').length,
    totalFatalities: investigations.reduce((sum, i) => sum + i.injuries.fatal, 0),
  };
}

/**
 * Computes yearly trend data from investigations.
 */
export function computeYearlyTrends(investigations: Investigation[]): YearlyTrend[] {
  const byYear = new Map<number, Investigation[]>();

  for (const inv of investigations) {
    const year = new Date(inv.eventDate).getFullYear();
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year)!.push(inv);
  }

  const years = Array.from(byYear.keys()).sort();

  return years.map((year) => {
    const group = byYear.get(year)!;
    return {
      year,
      total: group.length,
      runwayIncursions: group.filter((i) => i.subType === 'runway_incursion').length,
      categoryA: group.filter((i) => i.runwayIncursion?.category === 'A').length,
      categoryB: group.filter((i) => i.runwayIncursion?.category === 'B').length,
      fatal: group.filter((i) => i.severity === 'fatal').length,
      incidents: group.filter((i) => i.eventType === 'incident').length,
    };
  });
}

/**
 * Computes frequency table for a given field.
 */
export function computeFrequencyTable<T>(
  items: T[],
  keyFn: (item: T) => string
): Array<{ label: string; count: number; percentage: number }> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyFn(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const total = items.length;
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count, percentage: (count / total) * 100 }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Computes a risk score for a runway incursion investigation.
 * Score 0-100, higher is more severe.
 */
export function computeRiskScore(investigation: Investigation): number {
  let score = 0;

  // Runway incursion category
  const categoryScores: Record<string, number> = { A: 40, B: 30, C: 20, D: 10 };
  if (investigation.runwayIncursion) {
    score += categoryScores[investigation.runwayIncursion.category] ?? 0;
  }

  // Severity
  const severityScores: Record<string, number> = {
    fatal: 40, serious: 30, minor: 15, none: 0,
  };
  score += severityScores[investigation.severity] ?? 0;

  // Weather (LIFR/CAT III adds to risk)
  if (investigation.weather.flightCategory === 'LIFR') score += 15;
  else if (investigation.weather.flightCategory === 'IFR') score += 10;
  else if (investigation.weather.flightCategory === 'MVFR') score += 5;

  // Nighttime
  if (investigation.weather.nighttime) score += 5;

  // Missing infrastructure
  const missingInfra = investigation.infrastructure.filter((i) => !i.present && i.contributed);
  score += missingInfra.length * 5;

  // Human factors
  const highConfidenceFactors = investigation.humanFactors.filter((f) => f.confidence >= 85);
  score += highConfidenceFactors.length * 3;

  return Math.min(100, score);
}

/**
 * Generates a Swiss Cheese Model interpretation of an investigation.
 */
export interface SwissCheeseLayer {
  layer: string;
  failures: string[];
  present: boolean;
}

export function analyzeSwissCheese(investigation: Investigation): SwissCheeseLayer[] {
  return [
    {
      layer: 'Organizational Influences',
      failures: investigation.contributingFactors.filter((f) =>
        f.toLowerCase().includes('policy') ||
        f.toLowerCase().includes('training') ||
        f.toLowerCase().includes('resource')
      ),
      present: investigation.contributingFactors.some((f) =>
        f.toLowerCase().includes('policy') || f.toLowerCase().includes('training')
      ),
    },
    {
      layer: 'Unsafe Supervision',
      failures: investigation.contributingFactors.filter((f) =>
        f.toLowerCase().includes('supervision') ||
        f.toLowerCase().includes('oversight') ||
        f.toLowerCase().includes('controller')
      ),
      present: investigation.contributingFactors.some((f) =>
        f.toLowerCase().includes('controller') || f.toLowerCase().includes('supervisor')
      ),
    },
    {
      layer: 'Preconditions for Unsafe Acts',
      failures: [
        ...investigation.humanFactors
          .filter((f) => ['fatigue', 'workload', 'complacency'].includes(f.category))
          .map((f) => f.description),
        ...investigation.infrastructure
          .filter((i) => !i.present && i.contributed)
          .map((i) => `Missing: ${i.category}`),
      ],
      present:
        investigation.humanFactors.some((f) =>
          ['fatigue', 'workload', 'complacency'].includes(f.category)
        ) || investigation.infrastructure.some((i) => !i.present && i.contributed),
    },
    {
      layer: 'Unsafe Acts',
      failures: [
        ...investigation.humanFactors
          .filter((f) =>
            ['procedural_deviation', 'situational_awareness', 'communication'].includes(f.category)
          )
          .map((f) => f.description),
      ],
      present: investigation.humanFactors.some((f) =>
        ['procedural_deviation', 'situational_awareness', 'communication'].includes(f.category)
      ),
    },
    {
      layer: 'Defenses',
      failures: investigation.infrastructure
        .filter((i) => !i.present && i.contributed)
        .map((i) => `${i.category} was absent or non-functional`),
      present: investigation.infrastructure.some((i) => i.present && !i.contributed),
    },
  ];
}
