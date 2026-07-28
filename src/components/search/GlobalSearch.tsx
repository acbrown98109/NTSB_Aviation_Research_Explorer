import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { useAppStore } from '@/store/appStore';
import { useFilteredInvestigations } from '@/hooks/useInvestigations';
import { Badge, RunwayCategoryBadge } from '@/components/common/Badge';
import { formatDateShort } from '@/utils/format';

export function GlobalSearch() {
  const navigate = useNavigate();
  const { filters, setFilters, setAdvancedFiltersOpen, advancedFiltersOpen } = useAppStore();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: results } = useFilteredInvestigations(filters);
  const previewResults = results.slice(0, 6);
  const showDropdown = isFocused && filters.query.length >= 2 && previewResults.length > 0;

  const handleSelect = useCallback((id: string) => {
    setIsFocused(false);
    navigate(`/investigations/${id}`);
  }, [navigate]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setIsFocused(false);
    navigate('/investigations');
  }, [navigate]);

  const clearSearch = useCallback(() => {
    setFilters({ query: '' });
    inputRef.current?.focus();
  }, [setFilters]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest('[data-search-container]')) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div data-search-container className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999999] pointer-events-none" />

        <input
          ref={inputRef}
          data-search-input
          type="text"
          value={filters.query}
          onChange={(e) => setFilters({ query: e.target.value })}
          onFocus={() => setIsFocused(true)}
          placeholder="Search NTSB ID, airport, operator, keywords… (press / to focus)"
          className="w-full bg-white border border-[#cccccc] pl-9 pr-24 py-2.5 text-sm text-[#333333]
            placeholder:text-[#999999] focus:outline-none focus:border-[#0063a6] transition-colors"
          style={{ boxShadow: isFocused ? '0 0 0 1px #0063a6' : undefined }}
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {filters.query && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-1 text-[#999999] hover:text-[#333333] transition-colors"
            >
              <XMarkIcon className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setAdvancedFiltersOpen(!advancedFiltersOpen)}
            className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold transition-colors border ${
              advancedFiltersOpen
                ? 'bg-[#e1f0fa] text-[#003b75] border-[#0063a6]'
                : 'text-[#003b75] border-[#e0e0e0] hover:bg-[#f5f7f9]'
            }`}
            title="Toggle advanced filters"
          >
            <AdjustmentsHorizontalIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-[#e0e0e0] shadow-card-hover overflow-hidden"
          >
            <div>
              {previewResults.map((inv) => (
                <button
                  key={inv.id}
                  onClick={() => handleSelect(inv.id)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#f5f7f9] border-b border-[#f0f0f0] last:border-0 transition-colors group"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <span className="font-mono text-xs font-bold text-[#0063a6]">{inv.id}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-[#333333] font-semibold">
                        {inv.location.city}, {inv.location.stateAbbr}
                      </span>
                      {inv.runwayIncursion && (
                        <RunwayCategoryBadge category={inv.runwayIncursion.category} />
                      )}
                      <span className="text-xs text-[#999999]">{formatDateShort(inv.eventDate)}</span>
                    </div>
                    <p className="text-xs text-[#666666] truncate mt-0.5">{inv.synopsis}</p>
                  </div>
                  <div className="flex-shrink-0 flex gap-1 mt-0.5">
                    <Badge variant={inv.eventType === 'accident' ? 'danger' : 'info'} size="xs">
                      {inv.eventType}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
            {results.length > 6 && (
              <div className="px-4 py-2 bg-[#f5f7f9] border-t border-[#e0e0e0] flex items-center justify-between">
                <span className="text-xs text-[#666666]">{results.length} results</span>
                <button
                  onClick={() => { setIsFocused(false); navigate('/investigations'); }}
                  className="text-xs text-[#0063a6] hover:text-[#003b75] font-semibold underline"
                >
                  View all →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
