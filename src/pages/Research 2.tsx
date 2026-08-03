import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LightBulbIcon,
  ChartBarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { analyzeResearch, type ResearchAnalysis } from '@/services/gemini.service';
import { searchNtsb, type NtsbEvent } from '@/services/ntsb.service';
import { investigations as staticData } from '@/data/investigations';

type Status = 'idle' | 'fetching' | 'analyzing' | 'done' | 'error';

function buildStaticContext(topic: string): string {
  const lower = topic.toLowerCase();
  const words = lower.split(/\s+/).filter((w) => w.length > 3);
  const relevant = staticData.filter((inv) => {
    const text = [inv.narrative, inv.probableCause, inv.subType, inv.location?.city]
      .join(' ')
      .toLowerCase();
    return words.some((w) => text.includes(w));
  });
  const pool = relevant.length > 0 ? relevant : staticData;
  return pool
    .slice(0, 6)
    .map(
      (inv) =>
        `[${inv.id} – ${inv.eventDate}] ${inv.location?.airport ?? inv.location?.city}, ${inv.location?.stateAbbr}
Type: ${inv.subType?.replace(/_/g, ' ')} | Severity: ${inv.severity}
${inv.narrative}
Probable Cause: ${inv.probableCause}`
    )
    .join('\n\n');
}

function buildLiveContext(events: NtsbEvent[]): string {
  return events
    .slice(0, 30)
    .map(
      (e) =>
        `[${e.id} – ${e.eventDate}] ${e.airport ?? e.city}, ${e.state}
Type: ${e.eventType} | Severity: ${e.severity}
${e.narrative}
Probable Cause: ${e.probableCause}`
    )
    .join('\n\n');
}

export function ResearchPage() {
  const [topic, setTopic] = useState('');
  const [goal, setGoal] = useState('');
  const [customContext, setCustomContext] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<ResearchAnalysis | null>(null);
  const [liveCount, setLiveCount] = useState(0);
  const [error, setError] = useState('');

  async function handleAnalyze() {
    if (!topic.trim() || !goal.trim()) return;
    setStatus('fetching');
    setError('');
    setResult(null);
    setLiveCount(0);

    let ntsbContext = '';
    try {
      const events = await searchNtsb({ query: topic, limit: 50 });
      setLiveCount(events.length);
      ntsbContext = events.length > 0 ? buildLiveContext(events) : buildStaticContext(topic);
    } catch {
      // fall back to static data if the live API isn't available yet
      ntsbContext = buildStaticContext(topic);
    }

    const context = [ntsbContext, customContext].filter(Boolean).join('\n\n--- Additional Context ---\n');

    setStatus('analyzing');
    try {
      const analysis = await analyzeResearch('', topic, goal, context);
      setResult(analysis);
      setStatus('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setStatus('error');
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#003b75' }}>
          AI Research Analyzer
        </h1>
        <p className="text-sm text-[#666666]">
          Enter any research topic and your goal — Gemini AI will analyze NTSB data and surface
          patterns, insights, and recommendations tailored to your intention.
        </p>
      </div>

      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 p-4">
        <SparklesIcon className="h-5 w-5 text-[#0063a6] flex-shrink-0 mt-0.5" />
        <p className="text-sm text-[#003b75]">
          Searches the <strong>live NTSB accident database</strong> then uses Gemini AI to analyze
          results around your specific goal — no API key needed.
        </p>
      </div>

      {/* Input form */}
      <div className="bg-white border border-[#e0e0e0] p-5 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#333333] mb-1">
            Research Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. runway incursions, human factors in ATC, night landing accidents…"
            className="w-full border border-[#cccccc] px-3 py-2 text-sm text-[#333333] focus:outline-none focus:border-[#0063a6]"
          />
          <p className="text-xs text-[#888888] mt-1">
            Can be any topic — aviation or otherwise. NTSB data will be matched to relevant cases.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#333333] mb-1">
            Research Goal / Intention
          </label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={3}
            placeholder="e.g. I am writing a safety policy brief for a regional airline focused on reducing runway incursion risk during low-visibility conditions…"
            className="w-full border border-[#cccccc] px-3 py-2 text-sm text-[#333333] focus:outline-none focus:border-[#0063a6] resize-none"
          />
          <p className="text-xs text-[#888888] mt-1">
            Describe your purpose — the AI frames its analysis around your specific goal.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#333333] mb-1">
            Additional Context{' '}
            <span className="text-[#888888] font-normal">(optional)</span>
          </label>
          <textarea
            value={customContext}
            onChange={(e) => setCustomContext(e.target.value)}
            rows={4}
            placeholder="Paste any additional data, notes, articles, or context you want included in the analysis…"
            className="w-full border border-[#cccccc] px-3 py-2 text-sm text-[#333333] focus:outline-none focus:border-[#0063a6] resize-none"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!topic.trim() || !goal.trim() || status === 'fetching' || status === 'analyzing'}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#0063a6' }}
        >
          {status === 'fetching' || status === 'analyzing' ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              {status === 'fetching' ? 'Fetching NTSB data…' : 'Analyzing with Gemini…'}
            </>
          ) : (
            <>
              <SparklesIcon className="h-4 w-4" />
              Search &amp; Analyze
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {status === 'error' && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-800">
            <span className="font-semibold">Analysis failed:</span> {error}
          </div>
        </div>
      )}

      {/* Results */}
      {status === 'done' && result && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#0063a6]">
            <CheckCircleIcon className="h-4 w-4" />
            Analysis complete
            {liveCount > 0 && (
              <span className="ml-2 text-xs font-normal text-[#666666]">
                — {liveCount} live NTSB records retrieved
              </span>
            )}
          </div>

          {/* Summary */}
          <div className="bg-white border border-[#e0e0e0] p-5">
            <div className="flex items-center gap-2 mb-3">
              <DocumentTextIcon className="h-4 w-4 text-[#0063a6]" />
              <h2 className="text-sm font-bold text-[#003b75] uppercase tracking-wide">
                Summary of Findings
              </h2>
            </div>
            <p className="text-sm text-[#333333] leading-relaxed whitespace-pre-wrap">
              {result.summary}
            </p>
          </div>

          {/* Goal insights */}
          <div className="bg-[#e1f0fa] border border-[#b3d4ed] p-5">
            <div className="flex items-center gap-2 mb-3">
              <MagnifyingGlassIcon className="h-4 w-4 text-[#0063a6]" />
              <h2 className="text-sm font-bold text-[#003b75] uppercase tracking-wide">
                Analysis for Your Goal
              </h2>
            </div>
            <p className="text-sm text-[#1a3a5c] leading-relaxed whitespace-pre-wrap">
              {result.goalInsights}
            </p>
          </div>

          {/* Patterns */}
          <div className="bg-white border border-[#e0e0e0] p-5">
            <div className="flex items-center gap-2 mb-3">
              <ChartBarIcon className="h-4 w-4 text-[#0063a6]" />
              <h2 className="text-sm font-bold text-[#003b75] uppercase tracking-wide">
                Patterns Identified
              </h2>
            </div>
            <ul className="space-y-2">
              {result.patterns.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#333333]">
                  <span
                    className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ backgroundColor: '#0063a6' }}
                  >
                    {i + 1}
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="bg-white border border-[#e0e0e0] p-5">
            <div className="flex items-center gap-2 mb-3">
              <LightBulbIcon className="h-4 w-4 text-[#0063a6]" />
              <h2 className="text-sm font-bold text-[#003b75] uppercase tracking-wide">
                Recommendations
              </h2>
            </div>
            <ul className="space-y-2">
              {result.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#333333]">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Limitations */}
          <div className="bg-[#f5f7f9] border border-[#e0e0e0] p-4">
            <div className="flex items-start gap-2">
              <ExclamationTriangleIcon className="h-4 w-4 text-[#888888] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-[#555555] uppercase tracking-wide">
                  Limitations
                </span>
                <p className="text-xs text-[#666666] mt-1">{result.limitations}</p>
              </div>
            </div>
          </div>

          {/* NTSB data note */}
          <p className="text-xs text-[#aaaaaa]">
            {liveCount > 0
              ? `Analysis based on ${liveCount} live NTSB records.`
              : 'Live NTSB data unavailable — used local dataset as fallback.'}
            {' '}For educational and research use only.
          </p>
        </div>
      )}

    </div>
  );
}
