import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/common/Button';
import type { SearchFilters } from '@/types';

const US_STATES = [
  'AK','AL','AR','AZ','CA','CO','CT','DC','DE','FL','GA','HI','IA','ID','IL','IN',
  'KS','KY','LA','MA','MD','ME','MI','MN','MO','MS','MT','NC','ND','NE','NH','NJ',
  'NM','NV','NY','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VA','VT','WA',
  'WI','WV','WY',
];

interface FilterToggleProps {
  label: string;
  value: string;
  active: boolean;
  onChange: () => void;
  color?: string;
}

function FilterToggle({ label, value: _value, active, onChange, color }: FilterToggleProps) {
  return (
    <button
      onClick={onChange}
      className={`px-2.5 py-1 text-xs font-medium border transition-all duration-150 ${
        active
          ? color ?? 'bg-[#e1f0fa] text-[#003b75] border-[#0063a6]'
          : 'bg-white text-[#666666] border-[#e0e0e0] hover:border-[#0063a6] hover:text-[#333333]'
      }`}
    >
      {label}
    </button>
  );
}

function toggleInArray<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export function AdvancedFilters() {
  const { advancedFiltersOpen, setAdvancedFiltersOpen, filters, setFilters, resetFilters } =
    useAppStore();

  const activeFilterCount = [
    filters.states?.length,
    filters.subTypes?.length,
    filters.severity?.length,
    filters.runwayIncursionCategories?.length,
    filters.flightCategories?.length,
    filters.humanFactors?.length,
    filters.aircraftManufacturers?.length,
    filters.nighttime !== undefined ? 1 : 0,
  ].reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 0;

  const update = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) =>
    setFilters({ [key]: value } as Partial<SearchFilters>);

  return (
    <AnimatePresence>
      {advancedFiltersOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden border border-[#e0e0e0] bg-white"
        >
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[#333333]">Advanced Filters</h3>
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center h-5 w-5 bg-[#003b75] text-xs font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="xs" onClick={resetFilters}>
                    Clear all
                  </Button>
                )}
                <button
                  onClick={() => setAdvancedFiltersOpen(false)}
                  className="p-1 text-[#888888] hover:text-[#333333]"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Event Sub Type */}
              <div>
                <label className="text-xs font-medium text-[#666666] uppercase tracking-wider mb-2 block">
                  Event Type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Runway Incursion', value: 'runway_incursion' },
                    { label: 'Near Midair', value: 'near_midair_collision' },
                    { label: 'Loss of Sep.', value: 'loss_of_separation' },
                    { label: 'Ground Collision', value: 'ground_collision' },
                  ].map(({ label, value }) => (
                    <FilterToggle
                      key={value}
                      label={label}
                      value={value}
                      active={filters.subTypes?.includes(value as never) ?? false}
                      onChange={() =>
                        update('subTypes', toggleInArray(filters.subTypes ?? [], value as never))
                      }
                    />
                  ))}
                </div>
              </div>

              {/* RI Category */}
              <div>
                <label className="text-xs font-medium text-[#666666] uppercase tracking-wider mb-2 block">
                  Runway Incursion Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(['A', 'B', 'C', 'D'] as const).map((cat) => {
                    const colorMap = {
                      A: 'bg-red-50 text-red-700 border-red-300',
                      B: 'bg-orange-50 text-orange-700 border-orange-300',
                      C: 'bg-yellow-50 text-yellow-700 border-yellow-300',
                      D: 'bg-blue-50 text-blue-700 border-blue-300',
                    };
                    return (
                      <FilterToggle
                        key={cat}
                        label={`Cat ${cat}`}
                        value={cat}
                        active={filters.runwayIncursionCategories?.includes(cat) ?? false}
                        color={colorMap[cat]}
                        onChange={() =>
                          update(
                            'runwayIncursionCategories',
                            toggleInArray(filters.runwayIncursionCategories ?? [], cat)
                          )
                        }
                      />
                    );
                  })}
                </div>
              </div>

              {/* Flight Category / Weather */}
              <div>
                <label className="text-xs font-medium text-[#666666] uppercase tracking-wider mb-2 block">
                  Weather Conditions
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'VFR', color: 'bg-green-50 text-green-700 border-green-300' },
                    { label: 'MVFR', color: 'bg-blue-50 text-blue-700 border-blue-300' },
                    { label: 'IFR', color: 'bg-red-50 text-red-700 border-red-300' },
                    { label: 'LIFR', color: 'bg-purple-50 text-purple-700 border-purple-300' },
                  ].map(({ label, color }) => (
                    <FilterToggle
                      key={label}
                      label={label}
                      value={label}
                      active={filters.flightCategories?.includes(label) ?? false}
                      color={color}
                      onChange={() =>
                        update('flightCategories', toggleInArray(filters.flightCategories ?? [], label))
                      }
                    />
                  ))}
                  <FilterToggle
                    label="Nighttime"
                    value="nighttime"
                    active={filters.nighttime === true}
                    onChange={() =>
                      update('nighttime', filters.nighttime === true ? undefined : true)
                    }
                  />
                </div>
              </div>

              {/* Human Factors */}
              <div>
                <label className="text-xs font-medium text-[#666666] uppercase tracking-wider mb-2 block">
                  Human Factors
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Expectation Bias', value: 'expectation_bias' },
                    { label: 'Sit. Awareness', value: 'situational_awareness' },
                    { label: 'Communication', value: 'communication' },
                    { label: 'Fatigue', value: 'fatigue' },
                    { label: 'Workload', value: 'workload' },
                    { label: 'CRM', value: 'crew_resource_management' },
                    { label: 'Proc. Deviation', value: 'procedural_deviation' },
                  ].map(({ label, value }) => (
                    <FilterToggle
                      key={value}
                      label={label}
                      value={value}
                      active={filters.humanFactors?.includes(value as never) ?? false}
                      onChange={() =>
                        update('humanFactors', toggleInArray(filters.humanFactors ?? [], value as never))
                      }
                    />
                  ))}
                </div>
              </div>

              {/* State */}
              <div>
                <label className="text-xs font-medium text-[#666666] uppercase tracking-wider mb-2 block">
                  State
                </label>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {US_STATES.map((state) => (
                    <FilterToggle
                      key={state}
                      label={state}
                      value={state}
                      active={filters.states?.includes(state) ?? false}
                      onChange={() =>
                        update('states', toggleInArray(filters.states ?? [], state))
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="text-xs font-medium text-[#666666] uppercase tracking-wider mb-2 block">
                  Date Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={filters.dateRange?.start ?? ''}
                    onChange={(e) =>
                      update('dateRange', {
                        start: e.target.value,
                        end: filters.dateRange?.end ?? '',
                      })
                    }
                    className="flex-1 bg-white border border-[#cccccc] px-2 py-1.5 text-xs text-[#333333] focus:outline-none focus:border-[#0063a6]"
                  />
                  <span className="text-xs text-[#888888] self-center">to</span>
                  <input
                    type="date"
                    value={filters.dateRange?.end ?? ''}
                    onChange={(e) =>
                      update('dateRange', {
                        start: filters.dateRange?.start ?? '',
                        end: e.target.value,
                      })
                    }
                    className="flex-1 bg-white border border-[#cccccc] px-2 py-1.5 text-xs text-[#333333] focus:outline-none focus:border-[#0063a6]"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
