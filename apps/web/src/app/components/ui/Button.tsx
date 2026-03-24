import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, iconPosition = 'left', children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-accent-600 text-white border-accent-600 hover:bg-accent-700 focus:ring-accent-500',
      secondary: 'bg-neutral-100 text-neutral-900 border-neutral-200 hover:bg-neutral-200 focus:ring-neutral-500',
      outline: 'bg-transparent text-accent-600 border-accent-600 hover:bg-accent-50 focus:ring-accent-500',
      ghost: 'bg-transparent text-neutral-700 border-transparent hover:bg-neutral-100 focus:ring-neutral-500',
      destructive: 'bg-error-600 text-white border-error-600 hover:bg-error-700 focus:ring-error-500'
    };

    const sizes = {
      sm: 'px-3 py-2 text-xs rounded-md',
      md: 'px-4 py-3 text-sm rounded-md',
      lg: 'px-6 py-4 text-base rounded-lg',
      xl: 'px-8 py-5 text-lg rounded-lg'
    };

    const renderIcon = () => {
      if (!icon && !loading) return null;
      
      if (loading) {
        return (
          <svg 
            className="animate-spin h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
      }
      
      return icon;
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {iconPosition === 'left' && renderIcon()}
        {children}
        {iconPosition === 'right' && renderIcon()}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
