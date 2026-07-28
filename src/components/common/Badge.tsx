import type { ReactNode } from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info' | 'purple' | 'outline';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const variantClasses = {
  default: 'bg-[#e1f0fa] text-[#003b75] border border-[#bbd8f0]',
  danger:  'bg-red-50 text-red-700 border border-red-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  success: 'bg-green-50 text-green-700 border border-green-200',
  info:    'bg-blue-50 text-blue-700 border border-blue-200',
  purple:  'bg-purple-50 text-purple-700 border border-purple-200',
  outline: 'bg-white text-[#666666] border border-[#e0e0e0]',
};

const sizeClasses = {
  xs: 'text-[10px] px-1.5 py-0.5',
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
};

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-semibold tracking-wide',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, BadgeProps['variant']> = {
    fatal:   'danger',
    serious: 'warning',
    minor:   'info',
    none:    'success',
  };
  const labels: Record<string, string> = {
    fatal:   'Fatal',
    serious: 'Serious',
    minor:   'Minor',
    none:    'No Injury',
  };
  return <Badge variant={map[severity] ?? 'default'}>{labels[severity] ?? severity}</Badge>;
}

export function FlightCategoryBadge({ category }: { category: string }) {
  const map: Record<string, BadgeProps['variant']> = {
    VFR:  'success',
    MVFR: 'info',
    IFR:  'danger',
    LIFR: 'purple',
  };
  return <Badge variant={map[category] ?? 'default'}>{category}</Badge>;
}

export function RunwayCategoryBadge({ category }: { category: string }) {
  const map: Record<string, BadgeProps['variant']> = {
    A: 'danger',
    B: 'warning',
    C: 'info',
    D: 'success',
  };
  return <Badge variant={map[category] ?? 'default'}>Cat {category}</Badge>;
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeProps['variant']> = {
    open:        'warning',
    closed:      'success',
    preliminary: 'info',
  };
  return (
    <Badge variant={map[status] ?? 'default'} className="capitalize">
      {status}
    </Badge>
  );
}
