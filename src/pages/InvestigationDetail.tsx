import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  BookmarkIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  ClockIcon,
  UserIcon,
  WrenchScrewdriverIcon,
  ShieldExclamationIcon,
  LightBulbIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { useInvestigation } from '@/hooks/useInvestigations';
import { useNotebookStore } from '@/store/notebookStore';
import { generateCitation } from '@/services/citation.service';
import { exportToPDF } from '@/services/export.service';
import { Timeline } from '@/components/investigation/Timeline';
import { HumanFactorsPanel } from '@/components/investigation/HumanFactorsPanel';
import { InfrastructurePanel } from '@/components/investigation/InfrastructurePanel';
import { Card, SectionHeader } from '@/components/common/Card';
import {
  Badge,
  SeverityBadge,
  FlightCategoryBadge,
  RunwayCategoryBadge,
  StatusBadge,
} from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { computeRiskScore, analyzeSwissCheese } from '@/services/analysis.service';
import {
  formatDate,
  formatSubType,
} from '@/utils/format';

const TABS = [
  { id: 'summary', label: 'Summary', icon: DocumentTextIcon },
  { id: 'timeline', label: 'Timeline', icon: ClockIcon },
  { id: 'human-factors', label: 'Human Factors', icon: UserIcon },
  { id: 'infrastructure', label: 'Infrastructure', icon: WrenchScrewdriverIcon },
  { id: 'recommendations', label: 'Recommendations', icon: LightBulbIcon },
  { id: 'swiss-cheese', label: 'Swiss Cheese', icon: ShieldExclamationIcon },
];

export function InvestigationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const investigation = useInvestigation(id);
  const { isBookmarked, addBookmark, removeBookmark, addNote } = useNotebookStore();
  const [activeTab, setActiveTab] = useState('summary');
  const [noteText, setNoteText] = useState('');
  const [citationFormat, setCitationFormat] = useState<'APA' | 'MLA' | 'Chicago' | 'IEEE'>('APA');
  const [copied, setCopied] = useState(false);

  if (!investigation) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <ShieldExclamationIcon className="h-12 w-12 text-[#cccccc]" />
        <p className="text-[#666666]">Investigation {id} not found.</p>
        <Button variant="secondary" onClick={() => navigate('/investigations')}>
          ← Back to Investigations
        </Button>
      </div>
    );
  }

  const inv = investigation;
  const bookmarked = isBookmarked(inv.id);
  const riskScore = computeRiskScore(inv);
  const swissCheese = analyzeSwissCheese(inv);

  const citation = generateCitation(inv, citationFormat);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    exportToPDF([inv], {
      format: 'pdf',
      investigations: [inv],
      includeNarrative: true,
      includeRecommendations: true,
      includeTimeline: true,
      includeHumanFactors: true,
    });
  };

  const handleSaveNote = () => {
    if (noteText.trim()) {
      addNote(inv.id, noteText.trim());
      setNoteText('');
    }
  };

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Back nav */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-[#666666] hover:text-[#333333] transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </button>

      {/* Header card */}
      <Card padding="lg">
        <div className="flex flex-wrap items-start gap-4 justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="font-mono text-xl font-bold text-[#0063a6]">{inv.id}</span>
              {inv.runwayIncursion && (
                <RunwayCategoryBadge category={inv.runwayIncursion.category} />
              )}
              <SeverityBadge severity={inv.severity} />
              <StatusBadge status={inv.status} />
            </div>

            <h1 className="text-2xl font-bold text-[#333333] mb-1">
              {formatSubType(inv.subType)}
            </h1>
            <p className="text-[#666666]">
              {inv.location.airport
                ? `${inv.location.airport} (${inv.location.airportId})`
                : `${inv.location.city}, ${inv.location.stateAbbr}`}
              {' '}·{' '}
              {formatDate(inv.eventDate)} at {inv.eventTime} local
            </p>

            <p className="text-[#444444] text-sm mt-3 leading-relaxed">{inv.synopsis}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              <FlightCategoryBadge category={inv.weather.flightCategory} />
              {inv.weather.nighttime && <Badge variant="outline">Night</Badge>}
              {inv.weather.catIIIConditions && <Badge variant="purple">CAT III Conditions</Badge>}
              {inv.aircraft.map((ac, i) => (
                <Badge key={i} variant="outline">
                  {ac.manufacturer} {ac.model}
                </Badge>
              ))}
              {inv.runwayIncursion && (
                <Badge variant="default">Runway {inv.runwayIncursion.runway}</Badge>
              )}
            </div>
          </div>

          {/* Right: Risk score + actions */}
          <div className="flex flex-col gap-3 flex-shrink-0">
            <div className="text-center bg-[#f5f7f9] border border-[#e0e0e0] px-4 py-3 min-w-[100px]">
              <div className={`text-3xl font-black ${
                riskScore >= 75 ? 'text-red-600' :
                riskScore >= 50 ? 'text-amber-600' :
                riskScore >= 25 ? 'text-yellow-600' : 'text-green-700'
              }`}>
                {riskScore}
              </div>
              <div className="text-xs text-[#888888] mt-0.5">Risk Score</div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                icon={bookmarked ? <BookmarkSolid className="h-4 w-4 text-amber-500" /> : <BookmarkIcon className="h-4 w-4" />}
                onClick={() => bookmarked ? removeBookmark(inv.id) : addBookmark(inv.id)}
              >
                {bookmarked ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowDownTrayIcon className="h-4 w-4" />}
                onClick={handleExportPDF}
              >
                PDF
              </Button>
            </div>

            {inv.reportUrl && (
              <a
                href={inv.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#0063a6] hover:text-[#003b75] text-center"
              >
                NTSB Report ↗
              </a>
            )}
          </div>
        </div>
      </Card>

      {/* Key facts grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card padding="sm">
          <div className="text-xs text-[#888888] mb-1">Event Date</div>
          <div className="text-sm font-semibold text-[#333333]">{formatDate(inv.eventDate)}</div>
          <div className="text-xs text-[#666666]">{inv.eventTime} local</div>
        </Card>
        <Card padding="sm">
          <div className="text-xs text-[#888888] mb-1">Location</div>
          <div className="text-sm font-semibold text-[#333333]">
            {inv.location.airportId ?? inv.location.city}
          </div>
          <div className="text-xs text-[#666666]">{inv.location.city}, {inv.location.stateAbbr}</div>
        </Card>
        <Card padding="sm">
          <div className="text-xs text-[#888888] mb-1">Weather</div>
          <div className="text-sm font-semibold text-[#333333]">{inv.weather.flightCategory}</div>
          <div className="text-xs text-[#666666]">{inv.weather.visibility} SM vis{inv.weather.ceiling ? `, ${inv.weather.ceiling.toLocaleString()}ft ceil` : ''}</div>
        </Card>
        <Card padding="sm">
          <div className="text-xs text-[#888888] mb-1">Injuries</div>
          <div className="text-sm font-semibold text-[#333333]">
            {inv.injuries.fatal > 0 ? `${inv.injuries.fatal} fatal` :
             inv.injuries.serious > 0 ? `${inv.injuries.serious} serious` :
             'None'}
          </div>
          <div className="text-xs text-[#666666]">
            {inv.injuries.fatal + inv.injuries.serious + inv.injuries.minor + inv.injuries.none} total persons
          </div>
        </Card>
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
                  ? 'text-[#003b75] border-[#0063a6]'
                  : 'text-[#666666] hover:text-[#333333] border-transparent'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-4">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <Card padding="md">
                <SectionHeader title="Narrative" className="mb-3" />
                <div className="text-sm text-[#444444] leading-relaxed whitespace-pre-wrap font-sans">
                  {inv.narrative}
                </div>
              </Card>

              <Card padding="md" className="border-l-4 border-l-red-500">
                <SectionHeader title="Probable Cause" className="mb-3" />
                <p className="text-sm text-[#333333] leading-relaxed font-medium">{inv.probableCause}</p>
              </Card>

              <Card padding="md">
                <SectionHeader title="Contributing Factors" className="mb-3" />
                <ul className="space-y-2">
                  {inv.contributingFactors.map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-[#444444]">
                      <span className="text-[#0063a6] mt-0.5 flex-shrink-0">•</span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card padding="md">
                <SectionHeader title="Aircraft" className="mb-3" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {inv.aircraft.map((ac, idx) => (
                    <div key={idx} className="bg-[#f5f7f9] border border-[#e0e0e0] p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <PaperAirplaneIcon className="h-4 w-4 text-[#0063a6] rotate-45" />
                        <span className="text-sm font-bold text-[#333333]">
                          {ac.manufacturer} {ac.model}
                        </span>
                        <Badge variant={ac.role === 'primary' ? 'info' : 'outline'} size="xs">
                          {ac.role}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-[#666666]">
                        {ac.operator && <div>Operator: <span className="text-[#333333]">{ac.operator}</span></div>}
                        {ac.flightNumber && <div>Flight: <span className="text-[#333333] font-mono">{ac.flightNumber}</span></div>}
                        {ac.registration && <div>Reg: <span className="text-[#333333] font-mono">{ac.registration}</span></div>}
                        <div>Phase: <span className="text-[#333333] capitalize">{ac.flightPhase}</span></div>
                        {ac.passengers !== undefined && <div>Pax: <span className="text-[#333333]">{ac.passengers}</span></div>}
                        {ac.cargo && <div><Badge variant="default" size="xs">Cargo</Badge></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card padding="md">
                <div className="flex items-center justify-between mb-3">
                  <SectionHeader title="Academic Citation" />
                  <div className="flex gap-1">
                    {(['APA', 'MLA', 'Chicago', 'IEEE'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setCitationFormat(fmt)}
                        className={`px-2 py-1 text-xs font-medium transition-colors ${
                          citationFormat === fmt
                            ? 'bg-[#e1f0fa] text-[#003b75]'
                            : 'text-[#666666] hover:text-[#333333]'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-[#f5f7f9] border border-[#e0e0e0] p-3 text-xs text-[#444444] font-mono leading-relaxed mb-2">
                  {citation.text}
                </div>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => handleCopy(citation.text)}
                >
                  {copied ? '✓ Copied!' : 'Copy citation'}
                </Button>
              </Card>

              <Card padding="md">
                <SectionHeader title="Research Notes" className="mb-3" />
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add your research notes, observations, or analysis…"
                  rows={3}
                  className="w-full bg-white border border-[#cccccc] px-3 py-2 text-sm text-[#333333] placeholder:text-[#999999]
                    focus:outline-none focus:border-[#0063a6] resize-none mb-2"
                />
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!noteText.trim()}
                  onClick={handleSaveNote}
                >
                  Save Note
                </Button>
              </Card>
            </div>
          )}

          {activeTab === 'timeline' && (
            <Card padding="md">
              <SectionHeader
                title="Event Timeline"
                subtitle="Chronological sequence of events"
                className="mb-4"
              />
              <Timeline events={inv.timeline} />
            </Card>
          )}

          {activeTab === 'human-factors' && (
            <Card padding="md">
              <SectionHeader
                title="Human Factors Analysis"
                subtitle="Identified human performance factors contributing to this event"
                className="mb-4"
              />
              <HumanFactorsPanel factors={inv.humanFactors} />
            </Card>
          )}

          {activeTab === 'infrastructure' && (
            <Card padding="md">
              <SectionHeader
                title="Infrastructure Analysis"
                subtitle="Airport and system infrastructure factors"
                className="mb-4"
              />
              <InfrastructurePanel issues={inv.infrastructure} />
            </Card>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-3">
              {inv.recommendations.length === 0 ? (
                <Card padding="md">
                  <p className="text-sm text-[#888888] italic">
                    No safety recommendations issued for this investigation.
                  </p>
                </Card>
              ) : (
                inv.recommendations.map((rec) => (
                  <Card key={rec.id} padding="md" className={
                    rec.status === 'open'
                      ? 'border-l-4 border-l-amber-500'
                      : 'border-l-4 border-l-green-500'
                  }>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="font-mono text-sm font-bold text-[#0063a6]">{rec.id}</span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={rec.priority === 'urgent' ? 'danger' : rec.priority === 'priority' ? 'warning' : 'default'}
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
                    <p className="text-sm text-[#333333] leading-relaxed mb-2">{rec.text}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#888888]">
                      <span>Recipient: <span className="text-[#666666]">{rec.recipientName}</span></span>
                      <span>Issued: <span className="text-[#666666]">{rec.issueDate}</span></span>
                      {rec.closedDate && (
                        <span>Closed: <span className="text-[#666666]">{rec.closedDate}</span></span>
                      )}
                      <span>Category: <span className="text-[#666666]">{rec.category}</span></span>
                    </div>
                    {rec.closedDescription && (
                      <p className="text-xs text-green-700 mt-2 leading-relaxed">
                        ✓ {rec.closedDescription}
                      </p>
                    )}
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'swiss-cheese' && (
            <Card padding="md">
              <SectionHeader
                title="Swiss Cheese Model Analysis"
                subtitle="James Reason's organizational accident model applied to this investigation"
                className="mb-4"
              />
              <div className="space-y-3">
                {swissCheese.map((layer, idx) => (
                  <div
                    key={idx}
                    className={`border p-4 ${
                      layer.present && layer.failures.length > 0
                        ? 'border-red-200 bg-red-50'
                        : layer.present
                        ? 'border-green-200 bg-green-50'
                        : 'border-[#e0e0e0] bg-[#f5f7f9]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                        layer.present && layer.failures.length > 0
                          ? 'bg-red-500'
                          : layer.present
                          ? 'bg-green-500'
                          : 'bg-[#cccccc]'
                      }`} />
                      <span className="text-sm font-semibold text-[#333333]">
                        Layer {idx + 1}: {layer.layer}
                      </span>
                    </div>
                    {layer.failures.length > 0 ? (
                      <ul className="space-y-1">
                        {layer.failures.map((failure, fidx) => (
                          <li key={fidx} className="text-xs text-red-700 flex items-start gap-1.5">
                            <span className="text-red-500 mt-0.5 flex-shrink-0">⚠</span>
                            {failure}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-[#888888] italic">
                        No specific failures identified at this layer.
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-[#f5f7f9] border border-[#e0e0e0] text-xs text-[#666666] leading-relaxed">
                The Swiss Cheese Model (Reason, 1990) proposes that organizational accidents occur when holes in multiple defensive layers align, allowing a hazard to cause harm. Each layer represents a defense; failures are the "holes." This analysis is derived from the NTSB investigative record.
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
