import { useNavigate } from 'react-router-dom';
import {
  MapPinIcon,
  CalendarIcon,
  PaperAirplaneIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import type { Investigation } from '@/types';
import {
  Badge,
  SeverityBadge,
  FlightCategoryBadge,
  RunwayCategoryBadge,
  StatusBadge,
} from '@/components/common/Badge';
import { formatDateShort, formatSubType, truncate } from '@/utils/format';
import { useNotebookStore } from '@/store/notebookStore';

interface InvestigationCardProps {
  investigation: Investigation;
  compact?: boolean;
}

export function InvestigationCard({ investigation: inv, compact = false }: InvestigationCardProps) {
  const navigate = useNavigate();
  const { isBookmarked, addBookmark, removeBookmark } = useNotebookStore();
  const bookmarked = isBookmarked(inv.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarked) removeBookmark(inv.id);
    else addBookmark(inv.id);
  };

  return (
    <div
      onClick={() => navigate(`/investigations/${inv.id}`)}
      className="bg-white border border-[#e0e0e0] p-4 cursor-pointer transition-all duration-150
        hover:border-[#0063a6] hover:shadow-card-hover group"
    >
      {/* Header row */}
      <div className="flex items-start gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-bold text-[#0063a6] group-hover:text-[#003b75]">
              {inv.id}
            </span>
            {inv.runwayIncursion && <RunwayCategoryBadge category={inv.runwayIncursion.category} />}
            <Badge variant="outline" size="xs">{formatSubType(inv.subType)}</Badge>
            <StatusBadge status={inv.status} />
          </div>

          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-[#666666]">
              <MapPinIcon className="h-3 w-3" />
              {inv.location.airport
                ? `${inv.location.airport} (${inv.location.airportId})`
                : `${inv.location.city}, ${inv.location.stateAbbr}`}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#999999]">
              <CalendarIcon className="h-3 w-3" />
              {formatDateShort(inv.eventDate)} at {inv.eventTime}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <SeverityBadge severity={inv.severity} />
          <button
            onClick={handleBookmark}
            className="p-1.5 text-[#999999] hover:text-amber-500 transition-colors"
            title={bookmarked ? 'Remove bookmark' : 'Bookmark this investigation'}
          >
            {bookmarked
              ? <BookmarkSolidIcon className="h-4 w-4 text-amber-500" />
              : <BookmarkIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Synopsis */}
      {!compact && (
        <p className="text-sm text-[#444444] leading-relaxed mb-3">
          {truncate(inv.synopsis, 180)}
        </p>
      )}

      {/* Footer chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <FlightCategoryBadge category={inv.weather.flightCategory} />

        {inv.weather.nighttime && (
          <Badge variant="outline" size="xs">Night</Badge>
        )}
        {inv.weather.catIIIConditions && (
          <Badge variant="info" size="xs">CAT III Cond.</Badge>
        )}

        {inv.aircraft.slice(0, 2).map((ac, i) => (
          <span key={i} className="flex items-center gap-1 text-xs text-[#888888]">
            <PaperAirplaneIcon className="h-3 w-3 rotate-45" />
            {ac.manufacturer} {ac.model}
            {ac.flightNumber && (
              <span className="text-[#aaaaaa]">({ac.flightNumber})</span>
            )}
          </span>
        ))}

        {inv.recommendations.length > 0 && (
          <Badge variant="default" size="xs">
            {inv.recommendations.length} rec{inv.recommendations.length !== 1 ? 's' : ''}
          </Badge>
        )}

        {inv.runwayIncursion && (
          <Badge variant="outline" size="xs">RWY {inv.runwayIncursion.runway}</Badge>
        )}
      </div>
    </div>
  );
}
