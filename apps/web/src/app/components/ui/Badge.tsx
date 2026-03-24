import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'security';
  size?: 'sm' | 'md' | 'lg';
  status?: 'protected' | 'partial' | 'at-risk' | 'recovery' | 'revoked';
  icon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'neutral', size = 'md', status, icon, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full border';
    
    const variants = {
      success: 'bg-success-50 text-success-700 border-success-200',
      warning: 'bg-warning-50 text-warning-700 border-warning-200',
      error: 'bg-error-50 text-error-700 border-error-200',
      neutral: 'bg-neutral-100 text-neutral-700 border-neutral-200',
      security: 'bg-accent-50 text-accent-700 border-accent-200'
    };

    const statusVariants = {
      protected: 'bg-success-50 text-success-700 border-success-200',
      partial: 'bg-warning-50 text-warning-700 border-warning-200',
      'at-risk': 'bg-error-50 text-error-700 border-error-200',
      recovery: 'bg-accent-50 text-accent-700 border-accent-200',
      revoked: 'bg-neutral-100 text-neutral-700 border-neutral-200'
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-xs',
      lg: 'px-4 py-1.5 text-sm'
    };

    const finalVariant = status ? statusVariants[status] : variants[variant];

    return (
      <div
        ref={ref}
        className={cn(baseStyles, finalVariant, sizes[size], className)}
        {...props}
      >
        {icon}
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
