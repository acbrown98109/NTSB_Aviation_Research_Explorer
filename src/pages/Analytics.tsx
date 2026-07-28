import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useAllInvestigations } from '@/hooks/useInvestigations';
import { computeYearlyTrends, computeFrequencyTable } from '@/services/analysis.service';
import { Card, SectionHeader, StatCard } from '@/components/common/Card';
import { LoadingScreen } from '@/components/common/Spinner';
import { formatHumanFactor, formatInfrastructureCategory } from '@/utils/format';

const tooltipStyle = {
  contentStyle: {
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: 4,
    color: '#333333',
    fontSize: 12,
  },
};

export function AnalyticsPage() {
  const { data: all = [], isLoading } = useAllInvestigations();

  const trends = useMemo(() => computeYearlyTrends(all), [all]);

  const airportFreq = useMemo(
    () => computeFrequencyTable(
      all.filter((i) => i.location.airportId),
      (i) => `${i.location.airportId} (${i.location.city})`
    ).slice(0, 10),
    [all]
  );

  const stateFreq = useMemo(
    () => computeFrequencyTable(all, (i) => i.location.stateAbbr).slice(0, 10),
    [all]
  );

  const humanFactorFreq = useMemo(
    () =>
      computeFrequencyTable(
        all.flatMap((i) => i.humanFactors),
        (hf) => formatHumanFactor(hf.category)
      ).slice(0, 8),
    [all]
  );

  const weatherFreq = useMemo(
    () =>
      computeFrequencyTable(all, (i) => i.weather.flightCategory).slice(0, 6),
    [all]
  );

  const infraFreq = useMemo(
    () =>
      computeFrequencyTable(
        all.flatMap((i) => i.infrastructure.filter((inf) => !inf.present && inf.contributed)),
        (inf) => formatInfrastructureCategory(inf.category)
      ).slice(0, 8),
    [all]
  );

  const catData = [
    { name: 'Cat A', value: all.filter((i) => i.runwayIncursion?.category === 'A').length, fill: '#ef4444' },
    { name: 'Cat B', value: all.filter((i) => i.runwayIncursion?.category === 'B').length, fill: '#f59e0b' },
    { name: 'Cat C', value: all.filter((i) => i.runwayIncursion?.category === 'C').length, fill: '#3b82f6' },
    { name: 'Cat D', value: all.filter((i) => i.runwayIncursion?.category === 'D').length, fill: '#10b981' },
  ];

  if (isLoading) return <LoadingScreen label="Loading analytics…" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#003b75' }}>Analytics Dashboard</h1>
        <p className="text-sm text-[#666666]">
          Statistical analysis of {all.length} aviation safety investigations
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Events" value={all.length} variant="default" />
        <StatCard label="Runway Incursions" value={all.filter((i) => i.subType === 'runway_incursion').length} variant="warning" />
        <StatCard label="Category A" value={all.filter((i) => i.runwayIncursion?.category === 'A').length} variant="danger" />
        <StatCard label="Near Midair" value={all.filter((i) => i.subType === 'near_midair_collision').length} variant="danger" />
      </div>

      {/* Trend charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card padding="md">
          <SectionHeader title="Investigations by Year" className="mb-4" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fill: '#666666', fontSize: 11 }} />
              <YAxis tick={{ fill: '#666666', fontSize: 11 }} />
              <Tooltip {...tooltipStyle} />
              <Legend formatter={(v) => <span style={{ color: '#666666', fontSize: 11 }}>{v}</span>} />
              <Bar dataKey="runwayIncursions" name="Runway Incursions" fill="#f59e0b" radius={[3, 3, 0, 0]} />
              <Bar dataKey="total" name="Total" fill="#0063a6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card padding="md">
          <SectionHeader title="Category A Trend" className="mb-4" />
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fill: '#666666', fontSize: 11 }} />
              <YAxis tick={{ fill: '#666666', fontSize: 11 }} />
              <Tooltip {...tooltipStyle} />
              <Line
                type="monotone"
                dataKey="categoryA"
                name="Category A"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ fill: '#ef4444', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="categoryB"
                name="Category B"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 3 }}
                strokeDasharray="4 2"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Distribution charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card padding="md" className="col-span-1 lg:col-span-2">
          <SectionHeader title="Top Airports by Event Count" className="mb-4" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={airportFreq} layout="vertical" margin={{ left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#666666', fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fill: '#888888', fontSize: 11 }}
                width={100}
              />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" name="Events" fill="#0063a6" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card padding="md">
          <SectionHeader title="RI Categories" className="mb-4" />
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={catData}
                cx="50%"
                cy="45%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {catData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend
                formatter={(v) => <span style={{ color: '#666666', fontSize: 11 }}>{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Human factors + weather */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card padding="md">
          <SectionHeader title="Human Factors Frequency" className="mb-4" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={humanFactorFreq} layout="vertical" margin={{ left: 130 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#666666', fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fill: '#888888', fontSize: 11 }}
                width={130}
              />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" name="Count" fill="#f59e0b" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card padding="md">
          <SectionHeader title="Weather Conditions at Time of Event" className="mb-4" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weatherFreq}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fill: '#888888', fontSize: 11 }} />
              <YAxis tick={{ fill: '#666666', fontSize: 11 }} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" name="Events" radius={[3, 3, 0, 0]}>
                {weatherFreq.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={
                      entry.label === 'LIFR' ? '#a855f7' :
                      entry.label === 'IFR' ? '#ef4444' :
                      entry.label === 'MVFR' ? '#3b82f6' :
                      '#10b981'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Missing Infrastructure */}
      <Card padding="md">
        <SectionHeader
          title="Missing Infrastructure Contributing to Events"
          subtitle="Infrastructure absent or non-functional that contributed to each event"
          className="mb-4"
        />
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={infraFreq}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" tick={{ fill: '#888888', fontSize: 10 }} />
            <YAxis tick={{ fill: '#666666', fontSize: 11 }} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="count" name="Events" fill="#ef4444" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* State frequency */}
      <Card padding="md">
        <SectionHeader title="Events by State" className="mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {stateFreq.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between border border-[#e0e0e0] bg-[#f5f7f9] px-3 py-2"
            >
              <span className="text-sm font-bold text-[#333333]">{item.label}</span>
              <span className="text-sm font-bold text-[#0063a6]">{item.count}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
