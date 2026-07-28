import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldExclamationIcon,
  CloudIcon,
  WrenchScrewdriverIcon,
  UserIcon,
  ClockIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { Timeline } from '@/components/investigation/Timeline';
import { HumanFactorsPanel } from '@/components/investigation/HumanFactorsPanel';
import { InfrastructurePanel } from '@/components/investigation/InfrastructurePanel';
import { Card, SectionHeader, StatCard } from '@/components/common/Card';
import { Badge, RunwayCategoryBadge, FlightCategoryBadge } from '@/components/common/Badge';
import { computeRiskScore, analyzeSwissCheese } from '@/services/analysis.service';
import { useAllInvestigations } from '@/hooks/useInvestigations';
import { InvestigationCard } from '@/components/investigation/InvestigationCard';
import { getInvestigationById } from '@/data/investigations';

const AUS = getInvestigationById('DCA23MA142')!;

const TABS = [
  { id: 'overview', label: 'Overview', icon: DocumentTextIcon },
  { id: 'timeline', label: 'Timeline', icon: ClockIcon },
  { id: 'weather', label: 'Weather', icon: CloudIcon },
  { id: 'human-factors', label: 'Human Factors', icon: UserIcon },
  { id: 'infrastructure', label: 'Infrastructure', icon: WrenchScrewdriverIcon },
  { id: 'recommendations', label: 'Recommendations', icon: LightBulbIcon },
  { id: 'swiss-cheese', label: 'Risk Model', icon: ShieldExclamationIcon },
];

export function AustinDeepAnalysisPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: allInvestigations = [] } = useAllInvestigations();
  const riskScore = computeRiskScore(AUS);
  const swissCheese = analyzeSwissCheese(AUS);

  const similar = allInvestigations.filter(
    (inv) =>
      inv.id !== AUS.id &&
      (inv.runwayIncursion?.category === 'A' ||
        inv.weather.flightCategory === 'LIFR' ||
        inv.weather.catIIIConditions)
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Hero section */}
      <div className="bg-red-50 border border-red-200 border-l-4 border-l-red-600 p-6">
        <div className="flex items-center gap-2 mb-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
          <span className="text-xs font-bold uppercase tracking-widest text-red-700">
            Austin-Bergstrom International Airport · February 4, 2023
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#1a1a1a] mb-2">
          DCA23MA142 — Deep Analysis
        </h1>
        <p className="text-lg text-[#333333] font-medium mb-1">
          FedEx 1432 (B767) / Southwest 708 (B737)
        </p>
        <p className="text-sm text-[#666666] mb-4">
          Category A Runway Incursion · CAT III Fog Conditions · 1/4 SM Visibility · 0639 Local
        </p>
        <div className="flex flex-wrap gap-2">
          <RunwayCategoryBadge category="A" />
          <FlightCategoryBadge category="LIFR" />
          <Badge variant="danger">No ASDE-X</Badge>
          <Badge variant="danger">No RWSL</Badge>
          <Badge variant="warning">100 ft Vertical Separation</Badge>
          <Badge variant="purple">CAT III Conditions</Badge>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Risk Score" value={riskScore} subtitle="Out of 100" variant="danger" />
        <StatCard label="Vertical Sep." value="~100 ft" subtitle="At closest approach" variant="danger" />
        <StatCard label="Horizontal Sep." value="~1,000 ft" subtitle="At closest approach" variant="warning" />
        <StatCard label="Persons at Risk" value="130" subtitle="Crew + passengers" variant="info" />
      </div>

      {/* Tabs */}
      <div>
        <div className="flex border-b border-[#e0e0e0] overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'text-red-700 border-red-500'
                  : 'text-[#666666] hover:text-[#333333] border-transparent'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <Card padding="md" className="border-l-4 border-l-red-500">
                <SectionHeader title="Event Synopsis" className="mb-3" />
                <p className="text-sm text-[#333333] leading-relaxed font-medium">{AUS.synopsis}</p>
              </Card>

              <Card padding="md">
                <SectionHeader title="Full Narrative" className="mb-3" />
                <div className="text-sm text-[#444444] leading-relaxed whitespace-pre-wrap">
                  {AUS.narrative}
                </div>
              </Card>

              <Card padding="md" className="border-l-4 border-l-orange-500">
                <SectionHeader title="Probable Cause" className="mb-3" />
                <p className="text-sm text-[#333333] leading-relaxed">{AUS.probableCause}</p>
              </Card>

              <Card padding="md">
                <SectionHeader title="Aircraft Involved" className="mb-3" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {AUS.aircraft.map((ac, idx) => (
                    <div
                      key={idx}
                      className={`p-4 border ${
                        idx === 0
                          ? 'bg-purple-50 border-purple-200'
                          : 'bg-amber-50 border-amber-200'
                      }`}
                    >
                      <div className="text-sm font-bold text-[#333333] mb-2">
                        {ac.manufacturer} {ac.model}
                        <span className="text-xs text-[#888888] ml-2 font-normal">
                          ({ac.role === 'primary' ? 'Approach aircraft' : 'Departing aircraft'})
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#888888]">Operator</span>
                          <span className="text-[#333333]">{ac.operator}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#888888]">Flight</span>
                          <span className="text-[#333333] font-mono">{ac.flightNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#888888]">Registration</span>
                          <span className="text-[#333333] font-mono">{ac.registration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#888888]">Phase</span>
                          <span className="text-[#333333] capitalize">{ac.flightPhase}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#888888]">
                            {ac.cargo ? 'Cargo' : 'Passengers'}
                          </span>
                          <span className="text-[#333333]">
                            {ac.cargo ? 'Yes' : ac.passengers}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card padding="md">
                <SectionHeader title="Contributing Factors" className="mb-3" />
                <div className="space-y-2">
                  {AUS.contributingFactors.map((factor, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 bg-[#f5f7f9] border border-[#e0e0e0] p-3"
                    >
                      <ExclamationTriangleIcon className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-[#444444]">{factor}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'timeline' && (
            <Card padding="md">
              <SectionHeader
                title="Chronological Event Timeline"
                subtitle="Austin-Bergstrom International Airport · February 4, 2023"
                className="mb-6"
              />
              <Timeline events={AUS.timeline} />
            </Card>
          )}

          {activeTab === 'weather' && (
            <div className="space-y-4">
              <Card padding="md" className="border-l-4 border-l-purple-500">
                <SectionHeader title="Weather Conditions at Time of Event" className="mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Flight Category', value: 'LIFR', color: 'text-purple-700' },
                    { label: 'Visibility', value: '1/4 SM', color: 'text-red-600' },
                    { label: 'Ceiling', value: '200 ft OVC', color: 'text-red-600' },
                    { label: 'Condition', value: 'Dense Fog (FG)', color: 'text-[#333333]' },
                    { label: 'Wind', value: '350° at 4 kt', color: 'text-[#333333]' },
                    { label: 'Temperature', value: '7°C (45°F)', color: 'text-[#333333]' },
                    { label: 'Dewpoint', value: '7°C (100% RH)', color: 'text-[#333333]' },
                    { label: 'Altimeter', value: '29.88 inHg', color: 'text-[#333333]' },
                    { label: 'CAT III Ops?', value: 'Yes — authorized', color: 'text-amber-700' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-[#f5f7f9] border border-[#e0e0e0] p-3">
                      <div className="text-xs text-[#888888] mb-1">{label}</div>
                      <div className={`text-sm font-bold ${color}`}>{value}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card padding="md">
                <SectionHeader title="Raw METAR" className="mb-3" />
                <code className="block bg-[#f0f0f0] border border-[#e0e0e0] p-3 text-xs text-green-800 font-mono">
                  {AUS.weather.raw}
                </code>
              </Card>

              <Card padding="md">
                <SectionHeader title="Weather Significance" className="mb-3" />
                <div className="space-y-3 text-sm text-[#444444] leading-relaxed">
                  <p>
                    The weather at Austin-Bergstrom on February 4, 2023 represented <strong>LIFR (Low IFR)</strong> conditions — the lowest possible flight category. With visibility of only <strong>1/4 statute mile in dense radiation fog</strong> and a ceiling of 200 feet, these conditions met criteria for:
                  </p>
                  <ul className="space-y-1.5 ml-4">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-0.5">•</span>
                      <span><strong>CAT III ILS approach</strong> — the most demanding precision approach requiring special aircraft equipment, crew certification, and ground infrastructure.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-0.5">•</span>
                      <span><strong>Zero effective visual range</strong> — the airport surface was essentially invisible to controllers lacking ASDE-X surveillance equipment.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-0.5">•</span>
                      <span><strong>Radiation fog</strong> — common in Austin in winter, forming rapidly overnight and persisting through morning hours. ASOS automated observations may not capture rapidly developing fog patches.</span>
                    </li>
                  </ul>
                  <div className="bg-red-50 border border-red-200 p-3 mt-3">
                    <p className="text-red-800 font-medium text-xs">
                      ⚠ Critical Finding: In these visibility conditions, the local controller had no visual means of verifying aircraft positions on the airport surface, and KAUS lacked ASDE-X radar to provide electronic surveillance. Controllers relied entirely on pilot position reports and mental modeling — a system that failed catastrophically on this morning.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'human-factors' && (
            <div className="space-y-4">
              <Card padding="md">
                <SectionHeader
                  title="Human Factors Analysis"
                  subtitle="Factors identified in NTSB investigation with confidence levels"
                  className="mb-4"
                />
                <HumanFactorsPanel factors={AUS.humanFactors} />
              </Card>

              <Card padding="md">
                <SectionHeader title="Detailed Analysis: Expectation Bias (95%)" className="mb-3" />
                <div className="text-sm text-[#444444] leading-relaxed space-y-3">
                  <p>
                    Expectation bias — the tendency to perceive what one expects rather than what is actually occurring — is identified as the primary human factor in this event. The local controller cleared Southwest 708 for takeoff on runway 18L because the controller's mental model indicated that FedEx 1432 had already crossed the runway threshold and was on the ground.
                  </p>
                  <p>
                    This is consistent with established research on controller expectation errors (Wickens et al., 2009). Controllers develop strong mental models of traffic flows, and under high workload, these models can substitute for actual observation. With no surface radar to verify FedEx's actual position and zero visibility fog obscuring the runway, the controller's expectation became the only available "data."
                  </p>
                  <p>
                    The NTSB investigation found the controller released the Southwest frequency before FedEx had communicated its position over the final approach fix, supporting the conclusion that the controller "expected" FedEx to be further along in its approach than it was.
                  </p>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'infrastructure' && (
            <div className="space-y-4">
              <Card padding="md">
                <SectionHeader
                  title="Infrastructure Deficiencies"
                  subtitle="Equipment absent or non-functional that contributed to this event"
                  className="mb-4"
                />
                <InfrastructurePanel issues={AUS.infrastructure} />
              </Card>

              <Card padding="md" className="border-l-4 border-l-red-500">
                <SectionHeader title="ASDE-X: The Critical Gap" className="mb-3" />
                <div className="text-sm text-[#444444] leading-relaxed space-y-3">
                  <p>
                    ASDE-X (Airport Surface Detection Equipment Model X) is a surface movement radar system that provides controllers with real-time, labeled displays of all aircraft and vehicles on the airport surface. Unlike traditional primary radar, ASDE-X fuses data from multiple sensors including surface movement radar, multilateration, and ADS-B to produce precise, identified targets.
                  </p>
                  <p>
                    At the time of the DCA23MA142 event, Austin-Bergstrom International Airport did not have ASDE-X installed. The FAA had not prioritized KAUS for ASDE-X installation despite the airport's rapidly growing operations and its CAT III ILS capability.
                  </p>
                  <p>
                    By contrast, airports like JFK, ORD, ATL, and LAX have had ASDE-X for years and demonstrated its effectiveness in similar situations. In the DCA19LA071 (JFK) incident and WPR22IA145 (LAX) incident documented in this database, ASDE-X generated conflict alerts — though these demonstrate that even with ASDE-X, incursions occur when controllers cannot act in time.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 p-3">
                    <p className="text-amber-800 text-xs font-medium">
                      Post-Event: Following this incident, the FAA expedited ASDE-X installation at KAUS. The system became operational in late 2023. This remains one of the NTSB's most urgent open recommendations (A-23-016).
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-3">
              {AUS.recommendations.map((rec) => (
                <Card
                  key={rec.id}
                  padding="md"
                  className={
                    rec.status === 'open'
                      ? 'border-l-4 border-l-amber-500'
                      : 'border-l-4 border-l-green-500'
                  }
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="font-mono text-sm font-bold text-[#0063a6]">{rec.id}</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={rec.priority === 'urgent' ? 'danger' : 'warning'}
                        size="xs"
                        className="capitalize"
                      >
                        {rec.priority}
                      </Badge>
                      <Badge
                        variant={rec.status === 'open' ? 'warning' : 'success'}
                        size="xs"
                        className="capitalize"
                      >
                        {rec.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-[#333333] leading-relaxed mb-3">{rec.text}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#888888]">
                    <span>To: <span className="text-[#666666]">{rec.recipientName}</span></span>
                    <span>Issued: <span className="text-[#666666]">{rec.issueDate}</span></span>
                    {rec.closedDate && <span>Closed: <span className="text-green-700">{rec.closedDate}</span></span>}
                  </div>
                  {rec.closedDescription && (
                    <p className="text-xs text-green-700 mt-2">✓ {rec.closedDescription}</p>
                  )}
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'swiss-cheese' && (
            <div className="space-y-4">
              <Card padding="md">
                <SectionHeader
                  title="Swiss Cheese Risk Model"
                  subtitle="James Reason's organizational accident model applied to DCA23MA142"
                  className="mb-4"
                />

                <div className="space-y-3 mb-6">
                  {swissCheese.map((layer, idx) => (
                    <div
                      key={idx}
                      className={`border p-4 ${
                        layer.failures.length > 0
                          ? 'border-red-200 bg-red-50'
                          : 'border-[#e0e0e0] bg-[#f5f7f9]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${layer.failures.length > 0 ? 'bg-red-500' : 'bg-green-500'}`} />
                        <span className="text-sm font-bold text-[#333333]">
                          Layer {idx + 1}: {layer.layer}
                        </span>
                      </div>
                      {layer.failures.length > 0 ? (
                        <ul className="space-y-1.5">
                          {layer.failures.map((f, fi) => (
                            <li key={fi} className="text-xs text-red-700 flex items-start gap-1.5">
                              <span className="text-red-500 mt-0.5 flex-shrink-0">⚠</span>
                              {f}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-[#888888] italic">No failures at this layer.</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-[#f5f7f9] border border-[#e0e0e0] p-4 text-xs text-[#666666] leading-relaxed">
                  <p className="font-semibold text-[#333333] mb-2">Model Interpretation</p>
                  <p>
                    The Swiss Cheese Model (Reason, 1990) demonstrates how the DCA23MA142 event represents a classic organizational accident. Multiple defensive layers failed simultaneously:
                  </p>
                  <ul className="mt-2 space-y-1 ml-3">
                    <li>• <strong className="text-[#333333]">Organizational:</strong> No mandate requiring ASDE-X before CAT III operations</li>
                    <li>• <strong className="text-[#333333]">Supervisory:</strong> No procedural requirement to confirm approach aircraft position before issuing takeoff clearances</li>
                    <li>• <strong className="text-[#333333]">Preconditions:</strong> LIFR conditions creating extreme situational awareness demands; missing surveillance infrastructure</li>
                    <li>• <strong className="text-[#333333]">Unsafe Act:</strong> Expectation bias causing premature takeoff clearance</li>
                    <li>• <strong className="text-[#333333]">Defenses:</strong> TCAS worked; FedEx crew's visual acquisition and go-around decision prevented catastrophe</li>
                  </ul>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Similar investigations */}
      {similar.length > 0 && (
        <div>
          <SectionHeader
            title="Similar Investigations"
            subtitle="Other Category A incursions and LIFR/CAT III events in the database"
            className="mb-4"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {similar.map((inv) => (
              <InvestigationCard key={inv.id} investigation={inv} compact />
            ))}
          </div>
        </div>
      )}

      {/* Full investigation link */}
      <div className="text-center">
        <Link
          to="/investigations/DCA23MA142"
          className="inline-flex items-center gap-2 text-sm text-[#0063a6] hover:text-[#003b75] font-medium"
        >
          View full investigation record →
        </Link>
      </div>
    </div>
  );
}
