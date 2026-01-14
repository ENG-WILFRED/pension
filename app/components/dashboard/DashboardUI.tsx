import { ReactNode } from 'react';

interface DashboardContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Unified dashboard container with consistent background and spacing
 */
export function DashboardContainer({ children, className = '' }: DashboardContainerProps) {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 sm:px-6 lg:px-8 py-8 space-y-8 transition-colors duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Page header with optional icon
 */
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, icon, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div className="flex items-start gap-4">
        {icon && (
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
            <div className="text-white">{icon}</div>
          </div>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

/**
 * Stats grid with responsive columns
 */
interface StatsGridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
}

export function StatsGrid({ children, cols = 3 }: StatsGridProps) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return <div className={`grid ${colClasses[cols]} gap-4 sm:gap-6`}>{children}</div>;
}

/**
 * Unified card styling
 */
interface ContentCardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function ContentCard({ children, className = '', noPadding = false }: ContentCardProps) {
  return (
    <div
      className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
        noPadding ? '' : 'p-4 sm:p-6 lg:p-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}

import { PageLoader } from '@/app/components/loaders';

/**
 * Loading skeleton for dashboard
 */
export function DashboardLoading() {
  return <PageLoader />;
}

/**
 * Empty state component
 */
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <ContentCard className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="text-4xl mb-4 text-gray-400 dark:text-gray-600">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </ContentCard>
  );
}
