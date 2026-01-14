'use client';

import { Loader2 } from 'lucide-react';

/**
 * Main page loading spinner with AutoNest branding colors
 * Orange to blue gradient theme with decorative elements
 */
export function PageLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Animated gradient spinner */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-blue-500 to-orange-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
          <div className="absolute inset-2 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-300 font-medium">Loading your dashboard...</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Dashboard section loader with AutoNest theme
 * Used for data within dashboard pages
 */
export function DashboardSectionLoader({ message = 'Loading data...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full blur-lg opacity-60 animate-pulse"></div>
        <div className="absolute inset-3 bg-gradient-to-r from-orange-600 to-blue-500 rounded-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      </div>
      <p className="text-slate-600 dark:text-slate-300 font-medium text-center">{message}</p>
    </div>
  );
}

/**
 * Inline loader for forms and buttons
 * Compact spinner with text
 */
export function InlineLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2">
      <Loader2 className="w-5 h-5 animate-spin text-orange-600 dark:text-orange-400" />
      <span className="text-slate-600 dark:text-slate-300 font-medium">{label}</span>
    </div>
  );
}

/**
 * Card skeleton loader with AutoNest gradient theme
 * Used for loading individual cards or components
 */
export function CardSkeletonLoader() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 space-y-4 overflow-hidden relative">
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/5 animate-pulse"></div>
      
      <div className="relative space-y-4">
        {/* Title skeleton */}
        <div className="h-6 bg-gradient-to-r from-orange-200 to-blue-200 dark:from-orange-900/20 dark:to-blue-900/20 rounded-lg w-2/3 animate-pulse"></div>
        
        {/* Content skeletons */}
        <div className="space-y-3">
          <div className="h-4 bg-gradient-to-r from-orange-100 to-blue-100 dark:from-orange-900/10 dark:to-blue-900/10 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-orange-100 to-blue-100 dark:from-orange-900/10 dark:to-blue-900/10 rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-orange-100 to-blue-100 dark:from-orange-900/10 dark:to-blue-900/10 rounded w-4/6 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Button loading state spinner
 * Used inside buttons for action feedback
 */
export function ButtonLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  return (
    <Loader2 className={`${sizeClasses[size]} animate-spin text-white`} />
  );
}

/**
 * List items skeleton loader
 * Used for loading lists with multiple items
 */
export function ListSkeletonLoader({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 rounded-xl p-4 flex items-center gap-4 relative overflow-hidden"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent dark:via-white/2 animate-pulse"></div>
          
          <div className="relative flex-1 space-y-2 flex-1">
            <div className="h-4 bg-gradient-to-r from-orange-200 to-blue-200 dark:from-orange-900/20 dark:to-blue-900/20 rounded w-2/3 animate-pulse"></div>
            <div className="h-3 bg-gradient-to-r from-orange-100 to-blue-100 dark:from-orange-900/10 dark:to-blue-900/10 rounded w-1/2 animate-pulse"></div>
          </div>
          
          <div className="relative w-12 h-12 bg-gradient-to-r from-orange-200 to-blue-200 dark:from-orange-900/20 dark:to-blue-900/20 rounded-lg animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}

/**
 * Pulse dot loader
 * Animated dots for loading states
 */
export function PulseDotsLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-600 dark:text-slate-300 font-medium">{label}</span>
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-orange-600 dark:bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
        <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
        <span className="w-2 h-2 bg-orange-500 dark:bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
      </div>
    </div>
  );
}

/**
 * Table row skeleton loader
 * Used for loading table data
 */
export function TableRowSkeletonLoader({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg relative overflow-hidden">
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent dark:via-white/2 animate-pulse"></div>
          
          <div className="relative flex-1 flex gap-4">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <div
                key={colIdx}
                className="flex-1 h-4 bg-gradient-to-r from-orange-200 to-blue-200 dark:from-orange-900/20 dark:to-blue-900/20 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Full page transparent overlay loader
 * Used for blocking interactions during processing
 */
export function OverlayLoader({ message = 'Processing...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-sm mx-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-blue-500 to-orange-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
          <div className="absolute inset-2 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-300 font-medium text-center">{message}</p>
      </div>
    </div>
  );
}

/**
 * Minimal spinner
 * Simple orange/blue spinner for tight spaces
 */
export function MinimalSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  return (
    <div className={`${sizeClasses[size]} rounded-full border-3 border-orange-200 dark:border-orange-900/30 border-t-orange-600 dark:border-t-orange-400 border-r-blue-500 dark:border-r-blue-400 animate-spin`}></div>
  );
}
