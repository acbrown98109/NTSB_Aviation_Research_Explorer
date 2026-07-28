import { clsx } from 'clsx';
import type { TimelineEvent } from '@/types';

interface TimelineProps {
  events: TimelineEvent[];
}

const categoryConfig: Record<
  TimelineEvent['category'],
  { color: string; label: string; dot: string }
> = {
  atc: {
    color: 'text-blue-700',
    label: 'ATC',
    dot: 'bg-blue-500 ring-blue-200',
  },
  aircraft: {
    color: 'text-[#444444]',
    label: 'Aircraft',
    dot: 'bg-[#888888] ring-[#e0e0e0]',
  },
  weather: {
    color: 'text-cyan-700',
    label: 'Weather',
    dot: 'bg-cyan-500 ring-cyan-100',
  },
  infrastructure: {
    color: 'text-purple-700',
    label: 'Infrastructure',
    dot: 'bg-purple-500 ring-purple-100',
  },
  crew: {
    color: 'text-amber-700',
    label: 'Crew',
    dot: 'bg-amber-500 ring-amber-100',
  },
  system: {
    color: 'text-green-700',
    label: 'System',
    dot: 'bg-green-500 ring-green-100',
  },
};

export function Timeline({ events }: TimelineProps) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-[#888888] italic">No timeline data available for this investigation.</p>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[76px] top-3 bottom-3 w-px bg-[#e0e0e0]" />

      <div className="space-y-1">
        {events.map((event, idx) => {
          const config = categoryConfig[event.category];
          return (
            <div
              key={idx}
              className={clsx(
                'relative flex items-start gap-4 py-2 px-2 transition-colors',
                event.critical && 'bg-red-50 border border-red-100'
              )}
            >
              {/* Time */}
              <div className="flex-shrink-0 w-16 text-right">
                <span className="font-mono text-xs font-semibold text-[#666666]">
                  {event.time}
                </span>
              </div>

              {/* Dot */}
              <div className="flex-shrink-0 relative z-10 mt-0.5">
                <div
                  className={clsx(
                    'h-3 w-3 rounded-full ring-4',
                    event.critical
                      ? 'bg-red-500 ring-red-100'
                      : config.dot
                  )}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={clsx(
                      'text-[10px] font-bold uppercase tracking-wider',
                      event.critical ? 'text-red-600' : config.color
                    )}
                  >
                    {event.critical ? '⚠ CRITICAL' : config.label}
                  </span>
                </div>
                <p
                  className={clsx(
                    'text-sm leading-relaxed',
                    event.critical ? 'text-red-800 font-medium' : 'text-[#444444]'
                  )}
                >
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
