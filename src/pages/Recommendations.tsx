import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { allRecommendations } from '@/data/recommendations';
import { Card, StatCard, SectionHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';

type StatusFilter = 'all' | 'open' | 'closed' | 'superseded';

export function RecommendationsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    let recs = allRecommendations;

    if (search.trim()) {
      const q = search.toLowerCase();
      recs = recs.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.text.toLowerCase().includes(q) ||
          r.recipientName.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') recs = recs.filter((r) => r.status === statusFilter);
    if (priorityFilter !== 'all') recs = recs.filter((r) => r.priority === priorityFilter);

    return recs;
  }, [search, statusFilter, priorityFilter]);

  const openCount = allRecommendations.filter((r) => r.status === 'open').length;
  const closedCount = allRecommendations.filter((r) => r.status === 'closed').length;
  const urgentCount = allRecommendations.filter((r) => r.priority === 'urgent').length;

  const FilterChip = ({
    value,
    current,
    label,
    onChange,
  }: {
    value: string;
    current: string;
    label: string;
    onChange: () => void;
  }) => (
    <button
      onClick={onChange}
      className={`px-3 py-1.5 text-xs font-medium border transition-all ${
        current === value
          ? 'bg-[#e1f0fa] text-[#003b75] border-[#0063a6]'
          : 'border-[#e0e0e0] text-[#666666] hover:text-[#333333] hover:bg-[#f5f7f9]'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#003b75' }}>Safety Recommendations</h1>
        <p className="text-sm text-[#666666]">
          NTSB safety recommendations issued from aviation accident and incident investigations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Recommendations" value={allRecommendations.length} variant="default" />
        <StatCard label="Open" value={openCount} variant="warning" />
        <StatCard label="Closed" value={closedCount} variant="success" />
        <StatCard label="Urgent" value={urgentCount} variant="danger" />
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="space-y-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999999]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recommendations by ID, text, category, or recipient…"
              className="w-full bg-white border border-[#cccccc] pl-9 pr-4 py-2.5 text-sm text-[#333333] placeholder:text-[#999999]
                focus:outline-none focus:border-[#0063a6] transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-[#888888] self-center">Status:</span>
            {(['all', 'open', 'closed', 'superseded'] as const).map((s) => (
              <FilterChip
                key={s}
                value={s}
                current={statusFilter}
                label={s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                onChange={() => setStatusFilter(s)}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-[#888888] self-center">Priority:</span>
            {['all', 'urgent', 'priority', 'routine'].map((p) => (
              <FilterChip
                key={p}
                value={p}
                current={priorityFilter}
                label={p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
                onChange={() => setPriorityFilter(p)}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Results */}
      <div className="space-y-3">
        <SectionHeader
          title={`${filtered.length} Recommendation${filtered.length !== 1 ? 's' : ''}`}
          subtitle={search || statusFilter !== 'all' ? 'Filtered results' : undefined}
        />

        {filtered.length === 0 ? (
          <Card padding="md">
            <p className="text-sm text-[#888888] italic text-center py-4">
              No recommendations match your current filters.
            </p>
          </Card>
        ) : (
          filtered.map((rec) => (
            <div key={rec.id}>
              <Card
                padding="md"
                hover
                className={
                  rec.status === 'open'
                    ? 'border-l-4 border-l-amber-500'
                    : 'border-l-4 border-l-green-600'
                }
                onClick={() => navigate(`/investigations/${rec.investigationId}`)}
              >
                <div className="flex flex-wrap items-start gap-3 justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-[#0063a6]">{rec.id}</span>
                    <Badge
                      variant={
                        rec.priority === 'urgent'
                          ? 'danger'
                          : rec.priority === 'priority'
                          ? 'warning'
                          : 'outline'
                      }
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
                    <Badge variant="outline" size="xs">
                      {rec.category}
                    </Badge>
                  </div>
                  <span className="text-xs text-[#888888] font-mono">{rec.investigationId}</span>
                </div>

                <p className="text-sm text-[#333333] leading-relaxed mb-2">{rec.text}</p>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#888888]">
                  <span>
                    To: <span className="text-[#666666]">{rec.recipientName}</span>
                  </span>
                  <span>
                    Issued: <span className="text-[#666666]">{rec.issueDate}</span>
                  </span>
                  {rec.closedDate && (
                    <span>
                      Closed: <span className="text-green-700">{rec.closedDate}</span>
                    </span>
                  )}
                </div>

                {rec.closedDescription && (
                  <p className="text-xs text-green-700 mt-2 leading-relaxed">
                    ✓ {rec.closedDescription}
                  </p>
                )}
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
