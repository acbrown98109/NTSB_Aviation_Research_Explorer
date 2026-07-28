import { useState } from 'react';
import {
  FunnelIcon,
  TableCellsIcon,
  Squares2X2Icon,
  ArrowDownIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/outline';
import { useAppStore } from '@/store/appStore';
import { useFilteredInvestigations, useInvestigationStats } from '@/hooks/useInvestigations';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { AdvancedFilters } from '@/components/search/AdvancedFilters';
import { InvestigationCard } from '@/components/investigation/InvestigationCard';
import { Card } from '@/components/common/Card';
import { Badge, RunwayCategoryBadge, SeverityBadge, FlightCategoryBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingScreen } from '@/components/common/Spinner';
import { formatDateShort, formatSubType } from '@/utils/format';
import { useNavigate } from 'react-router-dom';

type SortField = 'date' | 'severity' | 'id';
type ViewMode = 'cards' | 'table';

export function InvestigationsPage() {
  const { filters } = useAppStore();
  const { data: filtered, isLoading } = useFilteredInvestigations(filters);
  const stats = useInvestigationStats(filtered);
  const navigate = useNavigate();

  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [page, setPage] = useState(1);

  const PER_PAGE = 20;

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'date') cmp = a.eventDate.localeCompare(b.eventDate);
    else if (sortField === 'id') cmp = a.id.localeCompare(b.id);
    else if (sortField === 'severity') {
      const order = { fatal: 3, serious: 2, minor: 1, none: 0 };
      cmp = (order[a.severity] ?? 0) - (order[b.severity] ?? 0);
    }
    return sortDir === 'desc' ? -cmp : cmp;
  });

  const paginated = sorted.slice(0, page * PER_PAGE);
  const hasMore = sorted.length > paginated.length;

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
    setPage(1);
  };

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => toggleSort(field)}
      className={`flex items-center gap-1 text-xs font-medium transition-colors ${
        sortField === field ? 'text-[#003b75]' : 'text-[#666666] hover:text-[#333333]'
      }`}
    >
      {label}
      {sortField === field &&
        (sortDir === 'desc' ? (
          <ArrowDownIcon className="h-3 w-3" />
        ) : (
          <ArrowUpIcon className="h-3 w-3" />
        ))}
    </button>
  );

  if (isLoading) return <LoadingScreen label="Loading investigations…" />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#003b75' }}>Investigations</h1>
        <p className="text-sm text-[#666666]">
          Aviation safety investigations database — {filtered.length} of all records
        </p>
      </div>

      {/* Search */}
      <div className="space-y-3">
        <GlobalSearch />
        <AdvancedFilters />
      </div>

      {/* Result stats + controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-[#666666]">
            <span className="font-semibold text-[#333333]">{filtered.length}</span> results
          </span>
          <div className="flex items-center gap-2 text-xs text-[#888888]">
            <span>Cat A: <span className="text-red-600 font-bold">{stats.catA}</span></span>
            <span>Cat B: <span className="text-amber-600 font-bold">{stats.catB}</span></span>
            <span>NMAC: <span className="text-purple-700 font-bold">{stats.nearMidair}</span></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <div className="flex items-center gap-2 bg-[#f5f7f9] border border-[#e0e0e0] px-3 py-1.5">
            <span className="text-xs text-[#888888]">Sort:</span>
            <SortButton field="date" label="Date" />
            <span className="text-[#cccccc]">|</span>
            <SortButton field="severity" label="Severity" />
            <span className="text-[#cccccc]">|</span>
            <SortButton field="id" label="ID" />
          </div>

          {/* View toggle */}
          <div className="flex items-center border border-[#e0e0e0] overflow-hidden">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 transition-colors ${
                viewMode === 'cards'
                  ? 'bg-[#e1f0fa] text-[#003b75]'
                  : 'text-[#888888] hover:text-[#333333] hover:bg-[#f5f7f9]'
              }`}
              title="Card view"
            >
              <Squares2X2Icon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#e1f0fa] text-[#003b75]'
                  : 'text-[#888888] hover:text-[#333333] hover:bg-[#f5f7f9]'
              }`}
              title="Table view"
            >
              <TableCellsIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FunnelIcon className="h-12 w-12" />}
          title="No investigations match your filters"
          description="Try adjusting your search terms or removing some filters."
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => useAppStore.getState().resetFilters()}
            >
              Clear filters
            </Button>
          }
        />
      ) : viewMode === 'cards' ? (
        <div className="space-y-3">
          {paginated.map((inv) => (
            <InvestigationCard key={inv.id} investigation={inv} />
          ))}

          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setPage((p) => p + 1)}
              >
                Load more ({sorted.length - paginated.length} remaining)
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e0e0e0] bg-[#f5f7f9]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider">
                    NTSB ID
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider">
                    Airport
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider">
                    Cat
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider">
                    Weather
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f0]">
                {paginated.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => navigate(`/investigations/${inv.id}`)}
                    className="hover:bg-[#f5f7f9] cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-[#0063a6] text-xs">
                        {inv.id}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#444444] whitespace-nowrap">
                      {formatDateShort(inv.eventDate)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[#333333]">{inv.location.airportId ?? '—'}</div>
                      <div className="text-xs text-[#888888]">
                        {inv.location.city}, {inv.location.stateAbbr}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" size="xs">
                        {formatSubType(inv.subType)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {inv.runwayIncursion ? (
                        <RunwayCategoryBadge category={inv.runwayIncursion.category} />
                      ) : (
                        <span className="text-[#aaaaaa]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <SeverityBadge severity={inv.severity} />
                    </td>
                    <td className="px-4 py-3">
                      <FlightCategoryBadge category={inv.weather.flightCategory} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={inv.status === 'open' ? 'warning' : 'success'}
                        size="xs"
                        className="capitalize"
                      >
                        {inv.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {hasMore && (
            <div className="flex justify-center p-4 border-t border-[#e0e0e0]">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
              >
                Load more ({sorted.length - paginated.length} remaining)
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
