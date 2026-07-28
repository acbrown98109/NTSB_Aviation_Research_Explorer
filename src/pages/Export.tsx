import { useState } from 'react';
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import { useAllInvestigations } from '@/hooks/useInvestigations';
import { useNotebookStore } from '@/store/notebookStore';
import { exportToCSV, exportToJSON, exportToMarkdown, exportToPDF } from '@/services/export.service';
import { Card, SectionHeader, StatCard } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import type { CitationFormat, ExportOptions } from '@/types';

export function ExportPage() {
  const { data: allInvestigations = [] } = useAllInvestigations();
  const { getBookmarkedIds } = useNotebookStore();
  const bookmarkedIds = getBookmarkedIds();
  const bookmarked = allInvestigations.filter((inv) => bookmarkedIds.includes(inv.id));

  const [scope, setScope] = useState<'all' | 'bookmarked'>('all');
  const [includeNarrative, setIncludeNarrative] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [includeTimeline, setIncludeTimeline] = useState(true);
  const [includeHumanFactors, setIncludeHumanFactors] = useState(true);
  const [citFormat, setCitFormat] = useState<CitationFormat>('APA');
  const [exporting, setExporting] = useState<string | null>(null);

  const target = scope === 'all' ? allInvestigations : bookmarked;

  const getOptions = (): ExportOptions => ({
    format: 'csv',
    investigations: target,
    includeNarrative,
    includeRecommendations,
    includeTimeline,
    includeHumanFactors,
    citationFormat: citFormat,
  });

  const handleExport = async (format: string) => {
    setExporting(format);
    try {
      switch (format) {
        case 'csv':
          exportToCSV(target);
          break;
        case 'json':
          exportToJSON(target);
          break;
        case 'markdown':
          exportToMarkdown(target, getOptions());
          break;
        case 'pdf':
          await exportToPDF(target, getOptions());
          break;
      }
    } finally {
      setExporting(null);
    }
  };

  const CheckOption = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 border-[#cccccc] text-[#003b75] focus:ring-[#0063a6]"
      />
      <span className="text-sm text-[#333333]">{label}</span>
    </label>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#003b75' }}>Export Data</h1>
        <p className="text-sm text-[#666666]">
          Download investigation data in multiple formats for analysis and research
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="All Investigations" value={allInvestigations.length} variant="default" />
        <StatCard label="Bookmarked" value={bookmarked.length} variant="info" />
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card padding="md">
          <SectionHeader title="Export Scope" className="mb-3" />
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={scope === 'all'}
                onChange={() => setScope('all')}
                className="text-[#003b75]"
              />
              <span className="text-sm text-[#333333]">
                All investigations ({allInvestigations.length})
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={scope === 'bookmarked'}
                onChange={() => setScope('bookmarked')}
                className="text-[#003b75]"
                disabled={bookmarked.length === 0}
              />
              <span className={`text-sm ${bookmarked.length === 0 ? 'text-[#aaaaaa]' : 'text-[#333333]'}`}>
                Bookmarked only ({bookmarked.length})
              </span>
            </label>
          </div>
        </Card>

        <Card padding="md">
          <SectionHeader title="Include Fields" className="mb-3" />
          <div className="space-y-2">
            <CheckOption label="Full narrative text" checked={includeNarrative} onChange={setIncludeNarrative} />
            <CheckOption label="Safety recommendations" checked={includeRecommendations} onChange={setIncludeRecommendations} />
            <CheckOption label="Event timeline" checked={includeTimeline} onChange={setIncludeTimeline} />
            <CheckOption label="Human factors analysis" checked={includeHumanFactors} onChange={setIncludeHumanFactors} />
          </div>
        </Card>
      </div>

      <Card padding="md">
        <SectionHeader title="Citation Format (Markdown & PDF)" className="mb-3" />
        <div className="flex gap-2">
          {(['APA', 'MLA', 'Chicago', 'IEEE'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setCitFormat(fmt)}
              className={`px-3 py-1.5 text-sm font-medium border transition-all ${
                citFormat === fmt
                  ? 'bg-[#e1f0fa] text-[#003b75] border-[#0063a6]'
                  : 'border-[#e0e0e0] text-[#666666] hover:text-[#333333]'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </Card>

      {/* Export buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <ExportButton
          format="CSV"
          description="Spreadsheet format for Excel, Google Sheets, or statistical analysis"
          icon={<TableCellsIcon className="h-6 w-6" />}
          color="text-green-600"
          count={target.length}
          loading={exporting === 'csv'}
          onClick={() => handleExport('csv')}
        />
        <ExportButton
          format="JSON"
          description="Machine-readable JSON for programming and data processing"
          icon={<CodeBracketIcon className="h-6 w-6" />}
          color="text-[#0063a6]"
          count={target.length}
          loading={exporting === 'json'}
          onClick={() => handleExport('json')}
        />
        <ExportButton
          format="Markdown"
          description="Formatted text with bibliography for research documents"
          icon={<DocumentTextIcon className="h-6 w-6" />}
          color="text-purple-700"
          count={target.length}
          loading={exporting === 'markdown'}
          onClick={() => handleExport('markdown')}
        />
        <ExportButton
          format="PDF"
          description="Print-ready report with all selected investigation details"
          icon={<ArrowDownTrayIcon className="h-6 w-6" />}
          color="text-red-600"
          count={target.length}
          loading={exporting === 'pdf'}
          onClick={() => handleExport('pdf')}
        />
      </div>
    </div>
  );
}

function ExportButton({
  format,
  description,
  icon,
  color,
  count,
  loading,
  onClick,
}: {
  format: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  count: number;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <Card hover padding="md" onClick={onClick} className="cursor-pointer group">
      <div className={`${color} mb-3 group-hover:scale-110 transition-transform duration-150`}>
        {icon}
      </div>
      <div className="font-bold text-[#333333] mb-1">{format}</div>
      <p className="text-xs text-[#666666] mb-3 leading-relaxed">{description}</p>
      <Button
        variant="primary"
        size="sm"
        loading={loading}
        className="w-full"
      >
        Download {count} record{count !== 1 ? 's' : ''} as {format}
      </Button>
    </Card>
  );
}
