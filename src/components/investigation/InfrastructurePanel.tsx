import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import type { InfrastructureIssue } from '@/types';
import { formatInfrastructureCategory } from '@/utils/format';

interface InfrastructurePanelProps {
  issues: InfrastructureIssue[];
}

export function InfrastructurePanel({ issues }: InfrastructurePanelProps) {
  if (issues.length === 0) {
    return (
      <p className="text-sm text-[#888888] italic">
        No infrastructure issues specifically identified in this investigation.
      </p>
    );
  }

  const critical = issues.filter((i) => !i.present && i.contributed);
  const contributing = issues.filter((i) => i.present && i.contributed);
  const present = issues.filter((i) => i.present && !i.contributed);

  const Section = ({
    title,
    items,
    icon,
    headerClass,
  }: {
    title: string;
    items: InfrastructureIssue[];
    icon: React.ReactNode;
    headerClass: string;
  }) => {
    if (items.length === 0) return null;
    return (
      <div>
        <div className={`flex items-center gap-2 mb-2 ${headerClass}`}>
          {icon}
          <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
        </div>
        <div className="space-y-2">
          {items.map((issue, idx) => (
            <div
              key={idx}
              className="bg-[#f5f7f9] border border-[#e0e0e0] p-3"
            >
              <div className="text-sm font-semibold text-[#333333] mb-1">
                {formatInfrastructureCategory(issue.category)}
              </div>
              <p className="text-xs text-[#666666] leading-relaxed">{issue.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Section
        title="Missing / Absent Infrastructure (Contributed to Event)"
        items={critical}
        icon={<XCircleIcon className="h-4 w-4" />}
        headerClass="text-red-600"
      />
      <Section
        title="Present But Contributing"
        items={contributing}
        icon={<XCircleIcon className="h-4 w-4" />}
        headerClass="text-orange-600"
      />
      <Section
        title="Present and Functioning"
        items={present}
        icon={<CheckCircleIcon className="h-4 w-4" />}
        headerClass="text-green-700"
      />
    </div>
  );
}
