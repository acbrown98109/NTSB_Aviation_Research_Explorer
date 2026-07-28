import type { ReactNode } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-[#cccccc] mb-4">
        {icon ?? <MagnifyingGlassIcon className="h-12 w-12" />}
      </div>
      <h3 className="text-lg font-semibold text-[#333333] mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[#666666] max-w-sm mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
