import {
  DocumentMagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  DocumentCheckIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useAllInvestigations, useInvestigationStats } from '@/hooks/useInvestigations';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { AdvancedFilters } from '@/components/search/AdvancedFilters';
import { StatCard, Card, SectionHeader } from '@/components/common/Card';
import { InvestigationCard } from '@/components/investigation/InvestigationCard';
import { LoadingScreen } from '@/components/common/Spinner';
import { computeYearlyTrends } from '@/services/analysis.service';

const CHART_COLORS = {
  primary: '#0063a6',
  danger:  '#dc2626',
  warning: '#d97706',
  success: '#059669',
  info:    '#0063a6',
  purple:  '#7c3aed',
};

const tooltipStyle = {
  contentStyle: {
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: 4,
    color: '#333333',
    fontSize: 12,
  },
};

export function DashboardPage() {
  const { data: all = [], isLoading } = useAllInvestigations();
  const stats = useInvestigationStats(all);
  const trends = computeYearlyTrends(all);

  if (isLoading) return <LoadingScreen label="Loading aviation database…" />;

  const recent = [...all]
    .sort((a, b) => b.eventDate.localeCompare(a.eventDate))
    .slice(0, 4);

  const catData = [
    { name: 'Cat A', value: stats.catA, fill: CHART_COLORS.danger },
    { name: 'Cat B', value: stats.catB, fill: CHART_COLORS.warning },
    { name: 'Cat C', value: stats.catC, fill: CHART_COLORS.info },
    { name: 'Cat D', value: stats.catD, fill: CHART_COLORS.success },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0063a6]">
            Aviation Safety Research
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-4" style={{ color: '#003b75' }}>
          NTSB Aviation Research Explorer
        </h1>
        <div className="space-y-3">
          <GlobalSearch />
          <AdvancedFilters />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          label="Total Investigations"
          value={stats.total}
          icon={<DocumentMagnifyingGlassIcon className="h-8 w-8" />}
          variant="default"
        />
        <StatCard
          label="Runway Incursions"
          value={stats.runwayIncursions}
          icon={<ExclamationTriangleIcon className="h-8 w-8" />}
          variant="warning"
        />
        <StatCard label="Category A" value={stats.catA} subtitle="Most severe" variant="danger" />
        <StatCard label="Category B" value={stats.catB} variant="warning" />
        <StatCard label="Category C" value={stats.catC} variant="info" />
        <StatCard label="Category D" value={stats.catD} variant="success" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Near Midair Collisions"
          value={stats.nearMidair}
          icon={<ShieldExclamationIcon className="h-8 w-8" />}
          variant="danger"
        />
        <StatCard
          label="Fatal Accidents"
          value={stats.fatal}
          icon={<ExclamationTriangleIcon className="h-8 w-8" />}
          variant="danger"
        />
        <StatCard
          label="Open Recommendations"
          value={stats.openRecs}
          icon={<ArrowTrendingUpIcon className="h-8 w-8" />}
          variant="warning"
        />
        <StatCard
          label="Closed Recommendations"
          value={stats.closedRecs}
          icon={<DocumentCheckIcon className="h-8 w-8" />}
          variant="success"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card padding="md">
          <SectionHeader title="Investigations by Year" className="mb-4" />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.danger} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_COLORS.danger} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fill: '#666666', fontSize: 11 }} />
              <YAxis tick={{ fill: '#666666', fontSize: 11 }} />
              <Tooltip {...tooltipStyle} />
              <Area
                type="monotone"
                dataKey="total"
                name="Total"
                stroke={CHART_COLORS.primary}
                fill="url(#colorTotal)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="runwayIncursions"
                name="Runway Incursions"
                stroke={CHART_COLORS.danger}
                fill="url(#colorRI)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card padding="md">
          <SectionHeader title="Runway Incursion Categories" className="mb-4" />
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={catData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {catData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend
                formatter={(value) => (
                  <span style={{ color: '#666666', fontSize: 12 }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Investigations */}
      <div>
        <SectionHeader
          title="Recent Investigations"
          subtitle="Latest aviation safety events in the database"
          action={
            <Link
              to="/investigations"
              className="text-sm text-[#0063a6] hover:text-[#003b75] font-medium"
            >
              View all →
            </Link>
          }
          className="mb-4"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {recent.map((inv) => (
            <InvestigationCard key={inv.id} investigation={inv} />
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Link to="/austin">
          <Card hover padding="md" className="border-l-4 border-l-red-500 group">
            <div className="flex items-center gap-3">
              <ShieldExclamationIcon className="h-8 w-8 text-red-500 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-[#333333] group-hover:text-[#003b75]">
                  Austin-Bergstrom Deep Dive
                </div>
                <div className="text-xs text-[#666666]">
                  FedEx 1432 / Southwest 708 — Feb 4, 2023 Cat A
                </div>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/analytics">
          <Card hover padding="md" className="border-l-4 border-l-[#0063a6] group">
            <div className="flex items-center gap-3">
              <ArrowTrendingUpIcon className="h-8 w-8 text-[#0063a6] flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-[#333333] group-hover:text-[#003b75]">
                  Statistical Analysis
                </div>
                <div className="text-xs text-[#666666]">
                  Trend analysis, frequency tables, risk scoring
                </div>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/recommendations">
          <Card hover padding="md" className="border-l-4 border-l-amber-500 group">
            <div className="flex items-center gap-3">
              <DocumentCheckIcon className="h-8 w-8 text-amber-500 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-[#333333] group-hover:text-[#003b75]">
                  Safety Recommendations
                </div>
                <div className="text-xs text-[#666666]">
                  {stats.openRecs} open, {stats.closedRecs} closed recommendations
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
