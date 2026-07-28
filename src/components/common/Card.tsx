import type { ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-6',
};

export function Card({ children, className, hover = false, onClick, padding = 'md' }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white border border-[#e0e0e0] shadow-card',
        paddingClasses[padding],
        hover && 'transition-all duration-150 hover:border-[#0063a6] hover:shadow-card-hover cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: { value: number; label: string };
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info';
  className?: string;
}

const variantAccent: Record<string, string> = {
  default: 'border-l-[#003b75]',
  danger:  'border-l-red-600',
  warning: 'border-l-amber-500',
  success: 'border-l-green-600',
  info:    'border-l-[#0063a6]',
};

const variantValue: Record<string, string> = {
  default: 'text-[#003b75]',
  danger:  'text-red-600',
  warning: 'text-amber-600',
  success: 'text-green-700',
  info:    'text-[#0063a6]',
};

export function StatCard({
  label,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  return (
    <Card
      className={clsx('border-l-4', variantAccent[variant], className)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-[#666666] uppercase tracking-widest truncate" style={{ letterSpacing: '1px' }}>
            {label}
          </p>
          <p className={clsx('text-2xl font-bold mt-1', variantValue[variant])}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-xs text-[#666666] mt-0.5">{subtitle}</p>
          )}
          {trend && (
            <p className={clsx('text-xs mt-1 font-medium', trend.value >= 0 ? 'text-red-600' : 'text-green-700')}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-3 text-[#0063a6] opacity-50">{icon}</div>
        )}
      </div>
    </Card>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div className={clsx('flex items-center justify-between', className)}>
      <div>
        <h2 className="text-lg font-semibold text-[#003b75]">{title}</h2>
        {subtitle && <p className="text-sm text-[#666666] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
