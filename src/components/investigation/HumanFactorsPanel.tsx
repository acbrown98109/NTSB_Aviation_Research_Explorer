import type { HumanFactor } from '@/types';
import { formatHumanFactor, humanFactorColor } from '@/utils/format';

interface HumanFactorsPanelProps {
  factors: HumanFactor[];
}

export function HumanFactorsPanel({ factors }: HumanFactorsPanelProps) {
  if (factors.length === 0) {
    return (
      <p className="text-sm text-[#888888] italic">
        No human factors explicitly identified in this investigation.
      </p>
    );
  }

  const sorted = [...factors].sort((a, b) => b.confidence - a.confidence);

  return (
    <div className="space-y-3">
      {sorted.map((factor, idx) => (
        <div
          key={idx}
          className="bg-[#f5f7f9] border border-[#e0e0e0] p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#333333]">
              {formatHumanFactor(factor.category)}
            </span>
            <span
              className={`text-sm font-bold ${humanFactorColor(factor.confidence)}`}
            >
              {factor.confidence}%
            </span>
          </div>

          {/* Confidence bar */}
          <div className="h-1.5 w-full bg-[#e0e0e0] mb-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                factor.confidence >= 85
                  ? 'bg-red-500'
                  : factor.confidence >= 70
                  ? 'bg-orange-500'
                  : factor.confidence >= 55
                  ? 'bg-yellow-500'
                  : 'bg-[#0063a6]'
              }`}
              style={{ width: `${factor.confidence}%` }}
            />
          </div>

          <p className="text-xs text-[#666666] leading-relaxed">{factor.description}</p>

          {factor.parties.length > 0 && (
            <div className="flex gap-1 mt-2">
              {factor.parties.map((party) => (
                <span
                  key={party}
                  className="px-1.5 py-0.5 text-[10px] font-medium bg-white border border-[#e0e0e0] text-[#666666] capitalize"
                >
                  {party.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
