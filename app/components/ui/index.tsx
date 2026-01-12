import { ReactNode } from 'react';
import { DESIGN_TOKENS, CARD_STYLE } from '@/app/lib/design-tokens';

// Card Component
interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return <div className={`${CARD_STYLE} ${className}`}>{children}</div>;
}

// Section Component
interface SectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export function Section({ title, subtitle, children, className = '', icon }: SectionProps) {
  return (
    <div className={`${DESIGN_TOKENS.padding.section} ${className}`}>
      {(title || subtitle || icon) && (
        <div className={`mb-6 flex items-start gap-3`}>
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <div>
            {title && <h2 className={`${DESIGN_TOKENS.typography.h2} mb-2`}>{title}</h2>}
            {subtitle && <p className={`${DESIGN_TOKENS.typography.bodySmall}`}>{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

// Button Component
interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  icon,
  fullWidth = false,
}: ButtonProps) {
  const baseClasses = `font-semibold rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`;

  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
    success: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white',
    danger: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white',
  };

  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-2.5 px-6 text-base',
    lg: 'py-3 px-8 text-lg',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}

// Input Component
interface InputProps {
  label?: string;
  error?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  name?: string;
  icon?: ReactNode;
}

export function Input({
  label,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  name,
  icon,
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className={`${DESIGN_TOKENS.typography.bodySmall} font-semibold text-gray-700 dark:text-gray-300`}>
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</div>}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full border rounded-lg p-3 ${
            icon ? 'pl-10' : ''
          } text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:bg-gray-100 dark:disabled:bg-gray-800 transition-colors duration-300 ${
            error
              ? 'border-red-500 focus:ring-red-500 dark:focus:ring-red-400'
              : 'border-gray-300 dark:border-gray-600'
          } ${className}`}
        />
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

// Label Component
interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
}

export function Label({ children, htmlFor, required = false }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
      {children} {required && <span className="text-red-600">*</span>}
    </label>
  );
}

// Alert Component
interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message?: string;
  children?: ReactNode;
  className?: string;
}

export function Alert({ variant = 'info', title, message, children, className = '' }: AlertProps) {
  const variantClasses = {
    success: `${DESIGN_TOKENS.colors.success[50]} ${DESIGN_TOKENS.colors.success.border}`,
    error: `${DESIGN_TOKENS.colors.error[50]} ${DESIGN_TOKENS.colors.error.border}`,
    warning: `${DESIGN_TOKENS.colors.warning[50]} ${DESIGN_TOKENS.colors.warning.border}`,
    info: `${DESIGN_TOKENS.colors.blue[50]} ${DESIGN_TOKENS.colors.blue.border}`,
  };

  const textClasses = {
    success: DESIGN_TOKENS.colors.success.text,
    error: DESIGN_TOKENS.colors.error.text,
    warning: DESIGN_TOKENS.colors.warning.text,
    info: DESIGN_TOKENS.colors.blue.text,
  };

  return (
    <div
      className={`border rounded-lg p-4 ${variantClasses[variant]} ${textClasses[variant]} ${DESIGN_TOKENS.transition} ${className}`}
    >
      {title && <p className="font-semibold mb-1">{title}</p>}
      {message && <p className="text-sm">{message}</p>}
      {children}
    </div>
  );
}

// Grid Component
interface GridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'xs' | 'sm' | 'md' | 'lg';
}

export function Grid({ children, cols = 1, gap = 'md' }: GridProps) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3 sm:gap-4',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
  };

  return (
    <div className={`grid ${colClasses[cols]} ${gapClasses[gap]}`}>
      {children}
    </div>
  );
}

// Badge Component
interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'primary', size = 'md' }: BadgeProps) {
  const variantClasses = {
    primary: `${DESIGN_TOKENS.colors.primary[50]} ${DESIGN_TOKENS.colors.primary.text}`,
    success: `${DESIGN_TOKENS.colors.success[50]} ${DESIGN_TOKENS.colors.success.text}`,
    warning: `${DESIGN_TOKENS.colors.warning[50]} ${DESIGN_TOKENS.colors.warning.text}`,
    error: `${DESIGN_TOKENS.colors.error[50]} ${DESIGN_TOKENS.colors.error.text}`,
    info: `${DESIGN_TOKENS.colors.blue[50]} ${DESIGN_TOKENS.colors.blue.text}`,
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {children}
    </span>
  );
}

// Stat Card Component
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

export function StatCard({ label, value, icon, change, className = '' }: StatCardProps) {
  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`${DESIGN_TOKENS.typography.bodySmall} mb-2`}>{label}</p>
          <p className={`${DESIGN_TOKENS.typography.h3}`}>{value}</p>
          {change && (
            <p
              className={`text-xs font-semibold mt-2 ${
                change.trend === 'up'
                  ? 'text-green-600 dark:text-green-400'
                  : change.trend === 'down'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {change.trend === 'up' ? '↑' : change.trend === 'down' ? '↓' : '→'} {Math.abs(change.value)}%
            </p>
          )}
        </div>
        {icon && <div className="text-indigo-600 dark:text-indigo-400">{icon}</div>}
      </div>
    </Card>
  );
}
